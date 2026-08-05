from flask import Blueprint, render_template, request
from flask_login import current_user, login_required

from app import db
from app.models.complaint import Complaint

user_bp = Blueprint("user", __name__, url_prefix="/user")


@user_bp.route("/grievance", methods=["GET", "POST"])
@login_required
def grievance():
    success_message = None
    error_message = None

    if request.method == "POST":
        title = (request.form.get("title") or "").strip()
        category = (request.form.get("category") or "").strip()
        description = (request.form.get("description") or "").strip()

        if not title or not category or not description:
            error_message = "All grievance fields are required."
        else:
            complaint = Complaint(
                title=title,
                category=category,
                description=description,
                user_id=current_user.id,
            )
            db.session.add(complaint)
            db.session.commit()
            success_message = "Your grievance has been submitted successfully."

    return render_template(
        "user/grievance.html",
        success_message=success_message,
        error_message=error_message,
    )