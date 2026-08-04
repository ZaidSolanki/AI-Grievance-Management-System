"""
=========================================
AI Grievance Management System
Application Configuration
=========================================
"""

from pathlib import Path


class Config:
    """
    Base Configuration
    """

    # Project Paths

    BASE_DIR = Path(__file__).resolve().parent

    DATABASE_PATH = BASE_DIR / "database" / "grievance.db"

    UPLOAD_FOLDER = BASE_DIR / "static" / "uploads" / "complaints"

    PROFILE_FOLDER = BASE_DIR / "static" / "uploads" / "profile"

    # Flask Configuration

    SECRET_KEY = "change_this_secret_key_before_production"

    MAX_CONTENT_LENGTH = 5 * 1024 * 1024   # 5 MB

    ALLOWED_EXTENSIONS = {
        "png",
        "jpg",
        "jpeg"
    }

    # Gemini AI

    GEMINI_MODEL = "gemini-2.5-flash"

    # API Key will be loaded later from .env
    GEMINI_API_KEY = None