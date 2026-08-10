from flask import Blueprint, jsonify, request, render_template, session, url_for
from flask_login import login_user, logout_user

from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("auth/register.html")

    data = request.get_json(silent=True) or request.form
    username = (data.get("username") or data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    phone = (data.get("phone") or "").strip()
    address = (data.get("address") or "").strip()
    role = (data.get("role") or "user").strip().lower()

    if not username:
        return jsonify({"message": "Username is required.", "field": "username"}), 400
    if len(username) < 2 or len(username) > 60:
        return jsonify({"message": "Username must be 2-60 characters.", "field": "username"}), 400

    if not email:
        return jsonify({"message": "Email is required.", "field": "email"}), 400
    if len(email) < 5 or len(email) > 120:
        return jsonify({"message": "Email must be 5-120 characters.", "field": "email"}), 400

    if not password:
        return jsonify({"message": "Password is required.", "field": "password"}), 400
    if len(password) < 6 or len(password) > 128:
        return jsonify({"message": "Password must be 6-128 characters.", "field": "password"}), 400

    if not phone:
        return jsonify({"message": "Phone number is required.", "field": "phone"}), 400

    if not address:
        return jsonify({"message": "Address is required.", "field": "address"}), 400

    try:
        user = AuthService.signup(username=username, email=email, password=password, role=role)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    return jsonify({"message": "Account created successfully", "role": user.role, "redirect_url": "/index.html"}), 201


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("auth/login.html")

    data = request.get_json(silent=True) or request.form
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "user").strip().lower()

    if not email:
        return jsonify({"message": "Email is required.", "field": "email"}), 400
    if len(email) < 5 or len(email) > 120:
        return jsonify({"message": "Email must be 5-120 characters.", "field": "email"}), 400

    if not password:
        return jsonify({"message": "Password is required.", "field": "password"}), 400
    if len(password) < 6 or len(password) > 128:
        return jsonify({"message": "Password must be 6-128 characters.", "field": "password"}), 400

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
            "redirect_url": "/index.html",
        }
    ), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    session.pop("role", None)
    return jsonify({"message": "Logged out"}), 200
