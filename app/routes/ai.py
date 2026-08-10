"""
=========================================
AI Routes
=========================================
"""

from flask import Blueprint, jsonify

ai_bp = Blueprint(
    "ai",
    __name__,
    url_prefix="/ai"
)


@ai_bp.route("/")
def ai_home():
    return jsonify({
        "module": "AI",
        "status": "working"
    })