"""
=========================================
User Routes
=========================================
"""

from flask import Blueprint, jsonify, redirect, render_template, request, url_for
from flask_login import current_user, login_required

from app.models.complaint import Complaint
from app.services.complaint_service import ComplaintService
from app.services.gemini_service import classify_severity

user_bp = Blueprint(
    "user",
    __name__,
    url_prefix="/user"
)

FORM_TO_DB_CATEGORY = {
    "Infrastructure": "Road",
    "Sanitation": "Garbage",
    "Water": "Water",
    "Electricity": "Electricity",
    "Safety": "Other",
    "Other": "Other",
}


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
            severity = classify_severity(title, category, description)
            db_category = FORM_TO_DB_CATEGORY.get(category, "Other")
            complaint = Complaint(
                user_id=current_user.id,
                title=title,
                description=description,
                category=db_category,
                status="Pending",
                severity=severity or "Medium",
            )
            ComplaintService.create_complaint(complaint)
            return redirect(url_for("user.complaint_history"))

    return render_template(
        "user/grievance.html",
        success_message=success_message,
        error_message=error_message,
        severity=severity,
    )


@user_bp.route("/complaint_history")
@login_required
def complaint_history():
    complaints = ComplaintService.get_user_complaints(current_user.id)
    complaints_list = [dict(row) for row in complaints]
    total = len(complaints_list)
    open_cases = sum(1 for c in complaints_list if c.get("status") == "Pending")
    resolved = sum(1 for c in complaints_list if c.get("status") == "Resolved")
    in_progress = sum(1 for c in complaints_list if c.get("status") == "In Progress")
    return render_template(
        "user/complaint_history.html",
        complaints=complaints_list,
        total=total,
        open_cases=open_cases,
        resolved=resolved,
        in_progress=in_progress,
    )
