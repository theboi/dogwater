from flask import Blueprint

summarize_comments_bp = Blueprint('summarize_comments', __name__)

@summarize_comments_bp.route('/summarize_comments', methods=['GET'])
def summarize_comments():
    return "Summarize comments endpoint"