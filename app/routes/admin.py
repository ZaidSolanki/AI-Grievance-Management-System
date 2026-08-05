"""
=========================================
AI Grievance Management System
Admin Routes
=========================================
"""

from flask import Blueprint, jsonify

from app.services.dashboard_service import DashboardService
from app.services.complaint_service import ComplaintService

admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/admin"
)


@admin_bp.route("/", methods=["GET"])
def admin_home():

    return jsonify({
        "module": "Admin",
        "status": "working"
    })


@admin_bp.route("/dashboard", methods=["GET"])
def dashboard():

    dashboard_data = DashboardService.get_dashboard_counts()

    return jsonify({
        "success": True,
        "dashboard": dashboard_data
    })


@admin_bp.route("/complaints", methods=["GET"])
def complaints():

    complaints = ComplaintService.get_all_complaints()

    return jsonify([dict(row) for row in complaints])