from flask import Blueprint, jsonify, request, render_template, session, url_for
from flask_login import login_user, logout_user

from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("auth/register.html")

    data = request.get_json(silent=True) or request.form
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "user").strip().lower()

    if not username or not email or not password:
        return jsonify({"message": "Username, email, and password are required"}), 400

    try:
        user = AuthService.signup(username=username, email=email, password=password, role=role)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    return jsonify({"message": "Account created successfully", "role": user.role}), 201


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("auth/login.html")

    data = request.get_json(silent=True) or request.form
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "user").strip().lower()

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    try:
        user = AuthService.login(email=email, password=password, role=role)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    login_user(user)
    session["role"] = user.role

    return jsonify(
        {
            "message": "Login successful",
            "role": user.role,
            "redirect_url": url_for("user.grievance"),
        }
    ), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    session.pop("role", None)
    return jsonify({"message": "Logged out"}), 200
