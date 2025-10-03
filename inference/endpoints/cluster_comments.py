from flask import Blueprint

cluster_comments_bp = Blueprint('cluster_comments', __name__)

@cluster_comments_bp.route('/cluster_comments', methods=['GET'])
def cluster_comments():
    return "Cluster comments endpoint"