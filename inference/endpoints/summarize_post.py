from flask import Blueprint, request, jsonify
from transformers import pipeline

summarize_post_bp = Blueprint("summarize_post", __name__)

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@summarize_post_bp.route("/summarize_post", methods=["POST"])
def summarize_post():
  data = request.get_json()
  if not(data and "text" in data):
    return jsonify({"error": "Missing 'text' in request body"}), 400
  input_text = data["text"]
  
  summary = summarizer(input_text, min_length=30, max_length=120, do_sample=False)
  return jsonify({"summary": summary[0]["summary_text"]})