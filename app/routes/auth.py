"""
=========================================
Authentication Routes
=========================================
"""

from flask import Blueprint, jsonify

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)


@auth_bp.route("/")
def auth_home():
    return jsonify({
        "module": "Authentication",
        "status": "working"
    })