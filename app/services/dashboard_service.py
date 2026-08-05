"""
=========================================
AI Grievance Management System
Dashboard Service
=========================================
"""

from app.database import get_db_connection


class DashboardService:
    """
    Handles dashboard related database operations.
    """

    @staticmethod
    def get_dashboard_counts():

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) AS total FROM complaints")
        total = cursor.fetchone()["total"]

        cursor.execute(
            "SELECT COUNT(*) AS pending FROM complaints WHERE status = 'Pending'"
        )
        pending = cursor.fetchone()["pending"]

        cursor.execute(
            "SELECT COUNT(*) AS in_progress FROM complaints WHERE status = 'In Progress'"
        )
        in_progress = cursor.fetchone()["in_progress"]

        cursor.execute(
            "SELECT COUNT(*) AS resolved FROM complaints WHERE status = 'Resolved'"
        )
        resolved = cursor.fetchone()["resolved"]

        connection.close()

        return {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "resolved": resolved
        }