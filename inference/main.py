from flask import Flask
from endpoints.summarize_post import summarize_post_bp
from endpoints.cluster_comments import cluster_comments_bp
from endpoints.summarize_comments import summarize_comments_bp

app = Flask(__name__)
app.register_blueprint(cluster_comments_bp)
app.register_blueprint(summarize_comments_bp)
app.register_blueprint(summarize_post_bp)

if __name__ == "__main__":
    app.run(port=5328)
