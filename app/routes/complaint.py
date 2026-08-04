"""
=========================================
Complaint Routes
=========================================
"""

from flask import Blueprint, jsonify

complaint_bp = Blueprint(
    "complaint",
    __name__,
    url_prefix="/complaint"
)


@complaint_bp.route("/")
def complaint_home():
    return jsonify({
        "module": "Complaint",
        "status": "working"
    })