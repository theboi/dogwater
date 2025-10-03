from flask import Blueprint, request, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.cluster import DBSCAN

cluster_comments_bp = Blueprint("cluster_comments", __name__)

embedder = SentenceTransformer("all-MiniLM-L6-v2")

@cluster_comments_bp.route("/cluster_comments", methods=["POST"])
def cluster_comments():
    data = request.get_json()
    if not data or "comments" not in data:
        return jsonify({"error": "Missing 'comments' in request body"}), 400

    comments = data["comments"]

    embeddings = embedder.encode(comments)
    if len(comments) == 1:
        embeddings = [embeddings]  # Ensure 2D shape for single comment

    # DBSCAN does not require n_clusters; eps and min_samples can be tuned
    clustering = DBSCAN(eps=1.0, min_samples=2).fit(embeddings)
    cluster_ids = clustering.labels_

    clusters = {}
    for idx, cluster_id in enumerate(cluster_ids):
        key = f"cluster_{cluster_id}" if cluster_id != -1 else "noise"
        if key not in clusters:
            clusters[key] = []
        clusters[key].append(comments[idx].split("COMMENT:", 1)[1].strip())

    return jsonify({"clusters": clusters})