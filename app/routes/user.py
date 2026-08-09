"""
=========================================
User Routes
=========================================
"""

from flask import Blueprint, jsonify, render_template, request
from flask_login import current_user, login_required

from app.db import create_complaint, update_complaint_severity
from app.services.gemini_service import classify_severity

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


user_bp = Blueprint("user", __name__, url_prefix="/user")


@user_bp.route("/grievance", methods=["GET", "POST"])
@login_required
def grievance():
    success_message = None
    error_message = None
    severity = None

    if request.method == "POST":
        title = (request.form.get("title") or "").strip()
        category = (request.form.get("category") or "").strip()
        description = (request.form.get("description") or "").strip()

        if not title or not category or not description:
            error_message = "All grievance fields are required."
        else:
            complaint = create_complaint(
                title=title,
                category=category,
                description=description,
                user_id=current_user.id,
            )
            severity = classify_severity(title, category, description)
            if severity and severity != complaint.severity:
                complaint = update_complaint_severity(complaint.id, severity)
            success_message = "Your grievance has been submitted successfully."

    return render_template(
        "user/grievance.html",
        success_message=success_message,
        error_message=error_message,
        severity=severity,
    )
