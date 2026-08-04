"""
=========================================
AI Grievance Management System
Flask Application Factory
=========================================
"""

from flask import Flask
from config import Config


def create_app():
    """
    Creates and configures the Flask application.
    """

    app = Flask(__name__)

    # =========================================
    # Load Configuration
    # =========================================

    app.config["SECRET_KEY"] = Config.SECRET_KEY
    app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH
    app.config["UPLOAD_FOLDER"] = str(Config.UPLOAD_FOLDER)

    # =========================================
    # Register Routes
    # =========================================

    from app.routes.auth import auth_bp
    from app.routes.user import user_bp
    from app.routes.admin import admin_bp
    from app.routes.complaint import complaint_bp
    from app.routes.ai import ai_bp
    from app.routes.api import api_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(complaint_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(api_bp)

    return app