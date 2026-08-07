import sqlite3
import os
from datetime import datetime
from contextlib import contextmanager

from app.models.user import User
from app.models.complaint import Complaint


DATABASE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app.db")


def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_cursor():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        yield cursor
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user'
        );
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'submitted',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER NOT NULL,
            severity TEXT NOT NULL DEFAULT 'Medium',
            FOREIGN KEY (user_id) REFERENCES users (id)
        );
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT
        );
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            read INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );
    """)
    conn.commit()
    conn.close()


def drop_all():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.executescript("""
        DROP TABLE IF EXISTS notifications;
        DROP TABLE IF EXISTS complaints;
        DROP TABLE IF EXISTS departments;
        DROP TABLE IF EXISTS users;
    """)
    conn.commit()
    conn.close()


def create_user(username, email, password_hash, role="user"):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            (username, email, password_hash, role),
        )
        user_id = cursor.lastrowid
    return get_user_by_id(user_id)


def get_user_by_id(user_id):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
    if row:
        return _row_to_user(row)
    return None


def get_user_by_email(email):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
    if row:
        return _row_to_user(row)
    return None


def _row_to_user(row):
    return User(
        id=row["id"],
        username=row["username"],
        email=row["email"],
        password_hash=row["password_hash"],
        role=row["role"],
    )


def create_complaint(title, category, description, user_id, status="submitted", created_at=None, severity="Medium"):
    if created_at is None:
        created_at = datetime.utcnow().isoformat()
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO complaints (title, category, description, status, created_at, user_id, severity) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (title, category, description, status, created_at, user_id, severity),
        )
        complaint_id = cursor.lastrowid
    return get_complaint_by_id(complaint_id)


def get_complaint_by_id(complaint_id):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM complaints WHERE id = ?", (complaint_id,))
        row = cursor.fetchone()
    if row:
        return _row_to_complaint(row)
    return None


def get_complaints_by_user_id(user_id):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        rows = cursor.fetchall()
    return [_row_to_complaint(row) for row in rows]


def update_complaint_severity(complaint_id, severity):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE complaints SET severity = ? WHERE id = ?",
            (severity, complaint_id),
        )
    return get_complaint_by_id(complaint_id)


def _row_to_complaint(row):
    return Complaint(
        id=row["id"],
        title=row["title"],
        category=row["category"],
        description=row["description"],
        status=row["status"],
        created_at=datetime.fromisoformat(row["created_at"]),
        user_id=row["user_id"],
        severity=row["severity"],
    )
