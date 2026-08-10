"""
=========================================
AI Grievance Management System
Database Initialization Script
=========================================
"""

import sqlite3
from pathlib import Path

# =========================================
# Project Paths
# =========================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASE_PATH = BASE_DIR / "database" / "grievance.db"
SCHEMA_PATH = BASE_DIR / "database" / "schema.sql"


# =========================================
# Create Database
# =========================================

def initialize_database():
    """
    Creates the database and executes schema.sql
    """

    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DATABASE_PATH)

    with open(SCHEMA_PATH, "r", encoding="utf-8") as schema:
        connection.executescript(schema.read())

    connection.commit()
    connection.close()

    print("✅ Database initialized successfully.")


# =========================================
# Insert Default Departments
# =========================================

def insert_departments():

    departments = [

        ("Road Department", "Handles road maintenance and potholes"),

        ("Water Department", "Handles water supply and leakage issues"),

        ("Electricity Department", "Handles power and street light complaints"),

        ("Garbage Department", "Handles garbage collection issues"),

        ("Sewer Department", "Handles drainage and sewer complaints"),

        ("Traffic Department", "Handles illegal parking and traffic issues")

    ]

    connection = sqlite3.connect(DATABASE_PATH)

    cursor = connection.cursor()

    cursor.executemany(

        """
        INSERT OR IGNORE INTO departments
        (department_name, description)

        VALUES (?, ?)
        """,

        departments

    )

    connection.commit()

    connection.close()

    print("✅ Default departments inserted.")


# =========================================
# Main
# =========================================

if __name__ == "__main__":

    initialize_database()

    insert_departments()

    print("🎉 Database setup completed successfully.")