import requests
import streamlit as st

# =============================
# CONFIG
# =============================
API_BASE =  "http://127.0.0.1:8000"
TMDB_IMG = "https://image.tmdb.org/t/p/w500"

st.set_page_config(page_title="Movie Recommender", page_icon="🎬", layout="wide")

# =============================
# STYLES (minimal modern)
# =============================
st.markdown(
    """
<style>
.block-container { padding-top: 1rem; padding-bottom: 2rem; max-width: 1400px; }
.small-muted { color:#6b7280; font-size: 0.92rem; }
.movie-title { font-size: 0.9rem; line-height: 1.15rem; height: 2.3rem; overflow: hidden; }
.card { border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; padding: 14px; background: rgba(255,255,255,0.7); }
</style>
""",
    unsafe_allow_html=True,
)

# =============================
# STATE + ROUTING (single-file pages)
# =============================
if "view" not in st.session_state:
    st.session_state.view = "home"  # home | details
if "selected_tmdb_id" not in st.session_state:
    st.session_state.selected_tmdb_id = None

qp_view = st.query_params.get("view")
qp_id = st.query_params.get("id")
if qp_view in ("home", "details"):
    st.session_state.view = qp_view
if qp_id:
    try:
        st.session_state.selected_tmdb_id = int(qp_id)
        st.session_state.view = "details"
    except:
        pass


def goto_home():
    st.session_state.view = "home"
    st.query_params["view"] = "home"
    if "id" in st.query_params:
        del st.query_params["id"]
    st.rerun()


def goto_details(tmdb_id: int):
    st.session_state.view = "details"
    st.session_state.selected_tmdb_id = int(tmdb_id)
    st.query_params["view"] = "details"
    st.query_params["id"] = str(int(tmdb_id))
    st.rerun()


# =============================
# API HELPERS
# =============================
@st.cache_data(ttl=30)  # short cache for autocomplete
def api_get_json(path: str, params: dict | None = None):
    try:
        r = requests.get(f"{API_BASE}{path}", params=params, timeout=25)
        if r.status_code >= 400:
            return None, f"HTTP {r.status_code}: {r.text[:300]}"
        return r.json(), None
    except Exception as e:
        return None, f"Request failed: {e}"


def poster_grid(cards, cols=6, key_prefix="grid"):
    if not cards:
        st.info("No movies to show.")
        return

    rows = (len(cards) + cols - 1) // cols
    idx = 0
    for r in range(rows):
        colset = st.columns(cols)
        for c in range(cols):
            if idx >= len(cards):
                break
            m = cards[idx]
            idx += 1

            tmdb_id = m.get("tmdb_id")
            title = m.get("title", "Untitled")
            poster = m.get("poster_url")

            with colset[c]:
                if poster:
                    st.image(poster, width="stretch")
                else:
                    st.write("🖼️ No poster")

                if st.button("Open", key=f"{key_prefix}_{r}_{c}_{idx}_{tmdb_id}"):
                    if tmdb_id:
                        goto_details(tmdb_id)

                st.markdown(
                    f"<div class='movie-title'>{title}</div>", unsafe_allow_html=True
                )


def to_cards_from_tfidf_items(tfidf_items):
    cards = []
    for x in tfidf_items or []:
        tmdb = x.get("tmdb") or {}
        if tmdb.get("tmdb_id"):
            cards.append(
                {
                    "tmdb_id": tmdb["tmdb_id"],
                    "title": tmdb.get("title") or x.get("title") or "Untitled",
                    "poster_url": tmdb.get("poster_url"),
                }
            )
    return cards


# =============================
# IMPORTANT: Robust TMDB search parsing
# Supports BOTH API shapes:
# 1) raw TMDB: {"results":[{id,title,poster_path,...}]}
# 2) list cards: [{tmdb_id,title,poster_url,...}]
# =============================
def parse_tmdb_search_to_cards(data, keyword: str, limit: int = 24):
    """
    Returns:
      suggestions: list[(label, tmdb_id)]
      cards: list[{tmdb_id,title,poster_url}]
    """
    keyword_l = keyword.strip().lower()

    # A) If API returns dict with 'results'
    if isinstance(data, dict) and "results" in data:
        raw = data.get("results") or []
        raw_items = []
        for m in raw:
            title = (m.get("title") or "").strip()
            tmdb_id = m.get("id")
            poster_path = m.get("poster_path")
            if not title or not tmdb_id:
                continue
            raw_items.append(
                {
                    "tmdb_id": int(tmdb_id),
                    "title": title,
                    "poster_url": f"{TMDB_IMG}{poster_path}" if poster_path else None,
                    "release_date": m.get("release_date", ""),
                }
            )

    # B) If API returns already as list
    elif isinstance(data, list):
        raw_items = []
        for m in data:
            # might be {tmdb_id,title,poster_url}
            tmdb_id = m.get("tmdb_id") or m.get("id")
            title = (m.get("title") or "").strip()
            poster_url = m.get("poster_url")
            if not title or not tmdb_id:
                continue
            raw_items.append(
                {
                    "tmdb_id": int(tmdb_id),
                    "title": title,
                    "poster_url": poster_url,
                    "release_date": m.get("release_date", ""),
                }
            )
    else:
        return [], []

    # Word-match filtering (contains)
    matched = [x for x in raw_items if keyword_l in x["title"].lower()]

    # If nothing matched, fallback to raw list (so never blank)
    final_list = matched if matched else raw_items

    # Suggestions = top 10 labels
    suggestions = []
    for x in final_list[:10]:
        year = (x.get("release_date") or "")[:4]
        label = f"{x['title']} ({year})" if year else x["title"]
        suggestions.append((label, x["tmdb_id"]))

    # Cards = top N
    cards = [
        {"tmdb_id": x["tmdb_id"], "title": x["title"], "poster_url": x["poster_url"]}
        for x in final_list[:limit]
    ]
    return suggestions, cards


# =============================
# SIDEBAR (clean)
# =============================
with st.sidebar:
    st.markdown("## 🎬 Menu")
    if st.button("🏠 Home"):
        goto_home()

    st.markdown("---")
    st.markdown("### 🏠 Home Feed (only home)")
    home_category = st.selectbox(
        "Category",
        ["trending", "popular", "top_rated", "now_playing", "upcoming"],
        index=0,
    )
    grid_cols = st.slider("Grid columns", 4, 8, 6)


# ==========================================================
# VIEW: HOME
# ==========================================================
if st.session_state.view == "home":

    # -------------------------
    # HEADER
    # -------------------------
    st.markdown("""
    <h1 style='font-size: 42px;'>🎬 CineMatch</h1>
    <p style='color: grey;'>Discover movies by mood and taste</p>
    """, unsafe_allow_html=True)

    st.markdown("---")

    # -------------------------
    # SEARCH
    # -------------------------
    typed = st.text_input(
        "Search by movie title",
        placeholder="Type: batman, avengers..."
    )

    if typed.strip():
        data, err = api_get_json("/tmdb/search", params={"query": typed.strip()})

        if not err and data:
            suggestions, cards = parse_tmdb_search_to_cards(data, typed.strip(), limit=24)

            st.markdown("### Results")
            poster_grid(cards, cols=grid_cols, key_prefix="search_results")

        st.stop()
    # -------------------------
    # 🎭 MOOD (MOVE HERE)
    # -------------------------
    st.markdown("""
    <div style="
        padding: 20px;
        border-radius: 12px;
        background-color: #111827;
        border: 1px solid #2d3748;
        margin-bottom: 10px;
    ">
    <h3>🎭 What are you in the mood for?</h3>
    <p style="color: grey;">Describe your mood and get personalized recommendations</p>
    </div>
    """, unsafe_allow_html=True)

    mood_input = st.text_input(
        "Your mood",
        placeholder="e.g. something light, funny and relaxing after a long day...",
        label_visibility="collapsed"
    )

    col1, col2 = st.columns([1, 5])

    with col1:
        mood_btn = st.button("✨ Recommend")

    if mood_btn:
        if mood_input.strip():
            data, err = api_get_json(
                "/recommend/mood",
                params={"text": mood_input.strip(), "top_n": 18}
            )

            if err or data is None:
                st.error(f"Error: {err}")
            else:
                cards = []
                for item in data:
                    tmdb = item.get("tmdb") or {}
                    if tmdb.get("tmdb_id"):
                        cards.append({
                            "tmdb_id": tmdb["tmdb_id"],
                            "title": tmdb.get("title") or item.get("title"),
                            "poster_url": tmdb.get("poster_url"),
                        })

                st.markdown("### 🎬 Recommendations for your mood")
                poster_grid(cards, cols=grid_cols, key_prefix="mood_results")

    st.markdown("<br>", unsafe_allow_html=True)


    # -------------------------
    # HOME FEED
    # -------------------------
    st.markdown("### 🔥 Trending Movies")

    home_cards, err = api_get_json(
        "/home", params={"category": home_category, "limit": 24}
    )

    if not err and home_cards:
        poster_grid(home_cards, cols=grid_cols, key_prefix="home_feed")

    st.markdown("---")


# ==========================================================
# VIEW: DETAILS
# ==========================================================
elif st.session_state.view == "details":

    # -------------------------
    # TOP SPACING + HEADER
    # -------------------------
    st.markdown("<br>", unsafe_allow_html=True)

    col_title, col_btn = st.columns([4, 1])
    with col_title:
        st.markdown("## 🎬 Movie Details")
    with col_btn:
        if st.button("← Back"):
            goto_home()

    st.markdown("---")

    # -------------------------
    # GET MOVIE ID
    # -------------------------
    tmdb_id = st.session_state.selected_tmdb_id

    if not tmdb_id:
        st.warning("No movie selected.")
        if st.button("← Back to Home"):
            goto_home()
        st.stop()

    # -------------------------
    # FETCH DETAILS
    # -------------------------
    data, err = api_get_json(f"/movie/id/{tmdb_id}")

    if err or not data:
        st.error(f"Could not load details: {err or 'Unknown error'}")
        st.stop()

    # -------------------------
    # MAIN LAYOUT
    # -------------------------
    left, right = st.columns([1, 2.2], gap="large")

    # 🎬 LEFT → POSTER
    with left:
        if data.get("poster_url"):
            st.image(data["poster_url"], width="stretch")
        else:
            st.write("🖼️ No poster available")

    # 📄 RIGHT → DETAILS
    with right:
        st.markdown(f"## {data.get('title','')}")

        release = data.get("release_date") or "-"
        genres = ", ".join([g["name"] for g in data.get("genres", [])]) or "-"

        st.markdown(f"**Release:** {release}")
        st.markdown(f"**Genres:** {genres}")

        st.markdown("---")

        st.markdown("### Overview")
        st.write(data.get("overview") or "No overview available.")

    # -------------------------
    # BACKDROP
    # -------------------------
    if data.get("backdrop_url"):
        st.markdown("### 🎞️ Backdrop")
        st.image(data["backdrop_url"], width="stretch")

    st.markdown("---")

    # -------------------------
    # RECOMMENDATIONS
    # -------------------------
    st.markdown("## 🍿 Recommendations")

    title = (data.get("title") or "").strip()

    if title:
        bundle, err2 = api_get_json(
            "/movie/search",
            params={"query": title, "tfidf_top_n": 12, "genre_limit": 12},
        )

        if not err2 and bundle:

            # 🔎 TF-IDF
            st.markdown("### 🔎 Similar Movies")
            poster_grid(
                to_cards_from_tfidf_items(bundle.get("tfidf_recommendations")),
                cols=grid_cols,
                key_prefix="details_tfidf",
            )

            # 🎭 GENRE
            st.markdown("### 🎭 More Like This")
            poster_grid(
                bundle.get("genre_recommendations", []),
                cols=grid_cols,
                key_prefix="details_genre",
            )

        else:
            st.info("Using fallback recommendations...")

            genre_only, err3 = api_get_json(
                "/recommend/genre",
                params={"tmdb_id": tmdb_id, "limit": 18}
            )

            if not err3 and genre_only:
                poster_grid(
                    genre_only,
                    cols=grid_cols,
                    key_prefix="details_genre_fallback"
                )
            else:
                st.warning("No recommendations available right now.")

    else:
        st.warning("No title available to compute recommendations.")