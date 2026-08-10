# AI Grievance Management System
# Database Connection Manager


import sqlite3
from pathlib import Path


# Database Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_PATH = BASE_DIR / "database" / "grievance.db"


# Database Connection


def get_db_connection():
    """
    Creates and returns a SQLite database connection.

    Returns:
        sqlite3.Connection
    """

    connection = sqlite3.connect(DATABASE_PATH)

    # Return rows as dictionary-like objects
    connection.row_factory = sqlite3.Row

    # Enable SQLite Foreign Keys
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


# Close Database Connection


def close_db_connection(connection):
    """
    Safely closes the database connection.
    """

    if connection is not None:
        connection.close()