import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# Load pickle files
df = pickle.load(open("df.pkl", "rb"))
indices = pickle.load(open("indices.pkl", "rb"))
tfidf = pickle.load(open("tfidf.pkl", "rb"))
tfidf_matrix = pickle.load(open("tfidf_matrix.pkl", "rb"))

# -------------------------------
# SIMILAR MOVIES FUNCTION
# -------------------------------
def get_similar_movies(title, n=10):
    title = title.lower().strip()

    # Find best match (partial + case-insensitive)
    matched_title = None
    for t in indices.index:
        if title == t.lower():
            matched_title = t
            break

    # If exact not found → try partial match
    if matched_title is None:
        for t in indices.index:
            if title in t.lower():
                matched_title = t
                break

    if matched_title is None:
        return []

    idx = indices[matched_title]

    sim_scores = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()
    similar_idx = sim_scores.argsort()[::-1][1:n+1]

    results = []
    for i in similar_idx:
        results.append({
            "title": df.iloc[i]['title'],
            "score": float(sim_scores[i])
        })

    return results


# -------------------------------
# MOOD FUNCTION
# -------------------------------
def get_recommendations_by_mood(text, n=10):
    if not text or not text.strip():
        return []

    mood_vector = tfidf.transform([text])
    sim_scores = cosine_similarity(mood_vector, tfidf_matrix).flatten()

    top_idx = sim_scores.argsort()[::-1][:n]

    results = []
    for i in top_idx:
        results.append({
            "title": df.iloc[i]['title'],
            "score": float(sim_scores[i])
        })

    return results

