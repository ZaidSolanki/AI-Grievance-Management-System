"""
=========================================
AI Grievance Management System
Application Configuration
=========================================
"""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent


class Config:
    BASE_DIR = BASE_DIR

    DATABASE_PATH = BASE_DIR / "database" / "grievance.db"

    UPLOAD_FOLDER = BASE_DIR / "static" / "uploads" / "complaints"
    PROFILE_FOLDER = BASE_DIR / "static" / "uploads" / "profile"

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    MAX_CONTENT_LENGTH = 5 * 1024 * 1024

    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

    GEMINI_MODEL = "gemini-2.5-flash"
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")