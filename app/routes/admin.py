"""
=========================================
Admin Routes
=========================================
"""

from flask import Blueprint, jsonify

admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/admin"
)


@admin_bp.route("/")
def admin_home():
    return jsonify({
        "module": "Admin",
        "status": "working"
    })