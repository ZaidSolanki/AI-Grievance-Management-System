"""
=========================================
User Routes
=========================================
"""

from flask import Blueprint, jsonify

user_bp = Blueprint(
    "user",
    __name__,
    url_prefix="/user"
)


@user_bp.route("/")
def user_home():
    return jsonify({
        "module": "User",
        "status": "working"
    })