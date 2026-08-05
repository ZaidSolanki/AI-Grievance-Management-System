from app import db
from app.models.user import User


class AuthService:
    @staticmethod
    def signup(username, email, password, role="user"):
        role = (role or "user").lower()
        if role not in {"user", "admin"}:
            raise ValueError("Invalid role")

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            raise ValueError("Email already registered")

        user = User(username=username, email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def login(email, password, role="user"):
        user = User.query.filter_by(email=email).first()
        if not user:
            raise ValueError("Invalid email or password")

        if not user.check_password(password):
            raise ValueError("Invalid email or password")

        if user.role != (role or "user").lower():
            raise ValueError("Selected role does not match the account")

        return user
