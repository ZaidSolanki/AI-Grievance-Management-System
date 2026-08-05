"""
=========================================
AI Grievance Management System
Complaint Service
=========================================
"""

from app.database import get_db_connection


class ComplaintService:
    """
    Handles all complaint-related database operations.
    """

    @staticmethod
    def create_complaint(complaint):

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO complaints
            (
                user_id,
                title,
                description,
                image_path,
                category,
                priority,
                department_id,
                status,
                location,
                latitude,
                longitude
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                complaint.user_id,
                complaint.title,
                complaint.description,
                complaint.image_path,
                complaint.category,
                complaint.priority,
                complaint.department_id,
                complaint.status,
                complaint.location,
                complaint.latitude,
                complaint.longitude
            )
        )

        connection.commit()

        complaint_id = cursor.lastrowid

        connection.close()

        return complaint_id

    @staticmethod
    def get_complaint_by_id(complaint_id):

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            "SELECT * FROM complaints WHERE id = ?",
            (complaint_id,)
        )

        complaint = cursor.fetchone()

        connection.close()

        return complaint

    @staticmethod
    def get_all_complaints():

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            "SELECT * FROM complaints ORDER BY created_at DESC"
        )

        complaints = cursor.fetchall()

        connection.close()

        return complaints

    @staticmethod
    def get_user_complaints(user_id):

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM complaints
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,)
        )

        complaints = cursor.fetchall()

        connection.close()

        return complaints

    @staticmethod
    def update_status(complaint_id, status):

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE complaints
            SET status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                status,
                complaint_id
            )
        )

        connection.commit()

        connection.close()

    @staticmethod
    def delete_complaint(complaint_id):

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM complaints
            WHERE id = ?
            """,
            (complaint_id,)
        )

        connection.commit()

        connection.close()