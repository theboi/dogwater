from flask import Blueprint, request, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.cluster import DBSCAN

cluster_comments_bp = Blueprint("cluster_comments", __name__)

# embedder = SentenceTransformer("unsloth/mistral-7b-instruct-v0.3")

@cluster_comments_bp.route("/cluster_comments", methods=["POST"])
def cluster_comments(test_data: str = None):
    # data = request.get_json() if not test_data else test_data
    # if not data or "comments" not in data:
    #     return jsonify({"error": "Missing 'comments' in request body"}), 400

    # comments = data["comments"]

    # embeddings = embedder.encode(comments)
    # if len(comments) == 1: embeddings = [embeddings]

    # clustering = DBSCAN(eps=0.5, min_samples=2).fit(embeddings)
    # cluster_ids = clustering.labels_

    # clusters = {}
    # for idx, cluster_id in enumerate(cluster_ids):
    #     key = f"cluster_{cluster_id}" if cluster_id != -1 else "noise"
    #     if key not in clusters:
    #         clusters[key] = []
    #     clusters[key].append(comments[idx].split("COMMENT:", 1)[1].strip())

    # return jsonify({"clusters": clusters})
    return ""