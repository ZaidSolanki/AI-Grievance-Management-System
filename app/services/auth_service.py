import re
from werkzeug.security import generate_password_hash, check_password_hash

from app.database import get_db_connection
from app.models.user import User


class AuthService:
    @staticmethod
    def signup(username, email, password, role="user", phone=None, address=None):
        role = (role or "user").lower().strip()
        if role not in {"user", "admin"}:
            raise ValueError("Invalid role. Role must be 'user' or 'admin'.")

        username = (username or "").strip()
        email = (email or "").strip().lower()
        password = password or ""

        if not username:
            raise ValueError("Username is required.")
        if len(username) < 2:
            raise ValueError("Username must be at least 2 characters.")
        if len(username) > 60:
            raise ValueError("Username must be under 60 characters.")
        if not re.match(r"^[A-Za-z0-9\u0900-\u097F\s.'-]+$", username):
            raise ValueError("Username can only contain letters, numbers, spaces, dots, hyphens, and apostrophes.")

        if not email:
            raise ValueError("Email is required.")
        if len(email) < 5:
            raise ValueError("Email must be at least 5 characters.")
        if len(email) > 120:
            raise ValueError("Email must be under 120 characters.")
        if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
            raise ValueError("Invalid email format.")

        if not password:
            raise ValueError("Password is required.")
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters.")
        if len(password) > 128:
            raise ValueError("Password must be under 128 characters.")

        existing_user = AuthService.get_user_by_email(email)
        if existing_user:
            raise ValueError("Email already registered.")

        password_hash = generate_password_hash(password)
        user = AuthService.create_user(
            username=username,
            email=email,
            password_hash=password_hash,
            role=role,
        )
        return user

    @staticmethod
    def login(email, password, role="user"):
        email = (email or "").strip().lower()
        password = password or ""
        role = (role or "user").lower().strip()

        if not email:
            raise ValueError("Email is required.")
        if len(email) < 5:
            raise ValueError("Email must be at least 5 characters.")
        if len(email) > 120:
            raise ValueError("Email must be under 120 characters.")
        if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
            raise ValueError("Invalid email format.")

        if not password:
            raise ValueError("Password is required.")
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters.")
        if len(password) > 128:
            raise ValueError("Password must be under 128 characters.")

        user = AuthService.get_user_by_email(email)
        if not user:
            raise ValueError("Invalid email or password.")

        if not user.check_password(password):
            raise ValueError("Invalid email or password.")

        if user.role != role:
            raise ValueError("Selected role does not match the account.")

        return user

    @staticmethod
    def create_user(username, email, password_hash, role="user"):
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO users (full_name, email, password, role)
            VALUES (?, ?, ?, ?)
            """,
            (username, email, password_hash, role),
        )

        connection.commit()
        user_id = cursor.lastrowid
        connection.close()

        return User(
            id=user_id,
            username=username,
            email=email,
            password_hash=password_hash,
            role=role,
        )

    @staticmethod
    def get_user_by_email(email):
        normalized_email = (email or "").strip().lower()
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE email = ?",
            (normalized_email,),
        )
        row = cursor.fetchone()
        connection.close()

        if row is None:
            return None

        return User(
            id=row["id"],
            username=row["full_name"],
            email=row["email"],
            password_hash=row["password"],
            role=row["role"],
        )

    @staticmethod
    def get_user_by_id(user_id):
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE id = ?",
            (user_id,),
        )
        row = cursor.fetchone()
        connection.close()

        if row is None:
            return None

        return User(
            id=row["id"],
            username=row["full_name"],
            email=row["email"],
            password_hash=row["password"],
            role=row["role"],
        )


def load_user(user_id):
    return AuthService.get_user_by_id(int(user_id))
