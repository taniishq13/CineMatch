import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

function toMovieCard(item) {
  if (!item || typeof item !== "object") return null;

  const tmdb_id = item.tmdb_id || item.id;
  const title = item.title || "Untitled";

  if (!tmdb_id) return null;

  return {
    tmdb_id,
    title,
    poster_url: item.poster_url || null,
    release_date: item.release_date || "",
    vote_average: item.vote_average ?? null,
  };
}

function normalizeCardList(data) {
  if (Array.isArray(data)) {
    return data.map(toMovieCard).filter(Boolean);
  }

  if (Array.isArray(data?.results)) {
    return data.results.map((item) => ({
      tmdb_id: item.id,
      title: item.title || item.name || "Untitled",
      poster_url: item.poster_path ? `${TMDB_IMG}${item.poster_path}` : null,
      release_date: item.release_date || "",
      vote_average: item.vote_average ?? null,
    })).filter((item) => item.tmdb_id);
  }

  return [];
}

/** Normalize raw TMDB search results into card shape */
function normalizeTMDBResults(data) {
  if (Array.isArray(data)) {
    return data.map((m) => ({
      tmdb_id: m.tmdb_id || m.id,
      title: m.title || "Untitled",
      poster_url: m.poster_url || null,
      release_date: m.release_date || "",
      vote_average: m.vote_average ?? null,
    }));
  }
  if (data?.results) {
    return data.results
      .filter((m) => m.id && m.title)
      .map((m) => ({
        tmdb_id: m.id,
        title: m.title,
        poster_url: m.poster_path ? `${TMDB_IMG}${m.poster_path}` : null,
        release_date: m.release_date || "",
        vote_average: m.vote_average ?? null,
      }));
  }
  return [];
}

/** Home feed */
export async function fetchHome(category = "trending", limit = 24) {
  const { data } = await api.get("/home", { params: { category, limit } });
  return normalizeCardList(data);
}

/** Search */
export async function searchMovies(query) {
  const { data } = await api.get("/tmdb/search", { params: { query } });
  return normalizeTMDBResults(data);
}

/** Movie details */
export async function fetchMovieDetails(tmdbId) {
  const { data } = await api.get(`/movie/id/${tmdbId}`);
  return data;
}

/** Mood recommendations */
export async function fetchMoodRecommendations(text, topN = 18) {
  const { data } = await api.get("/recommend/mood", {
    params: { text, top_n: topN },
  });
  return (Array.isArray(data) ? data : [])
    .filter((item) => item?.tmdb?.tmdb_id)
    .map((item) => ({
      tmdb_id: item.tmdb.tmdb_id,
      title: item.tmdb.title || item.title || "Untitled",
      poster_url: item.tmdb.poster_url || null,
      score: item.score,
    }));
}

/** Recommendations bundle for a movie */
export async function fetchRecommendations(
  title,
  tfidfTopN = 12,
  genreLimit = 12,
) {
  const { data } = await api.get("/movie/search", {
    params: { query: title, tfidf_top_n: tfidfTopN, genre_limit: genreLimit },
  });

  const tfidf = (data.tfidf_recommendations || [])
    .filter((x) => x?.tmdb?.tmdb_id)
    .map((x) => ({
      tmdb_id: x.tmdb.tmdb_id,
      title: x.tmdb.title || x.title || "Untitled",
      poster_url: x.tmdb.poster_url || null,
    }));

  const genre = (data.genre_recommendations || []).map((m) => ({
    tmdb_id: m.tmdb_id,
    title: m.title || "Untitled",
    poster_url: m.poster_url || null,
  }));

  return { tfidf, genre };
}

/** Genre-based fallback */
export async function fetchGenreRecommendations(tmdbId, limit = 18) {
  const { data } = await api.get("/recommend/genre", {
    params: { tmdb_id: tmdbId, limit },
  });
  return normalizeCardList(data);
}
