from app.db import get_user_by_email, create_user


class AuthService:
    @staticmethod
    def signup(username, email, password, role="user"):
        role = (role or "user").lower()
        if role not in {"user", "admin"}:
            raise ValueError("Invalid role")

        existing_user = get_user_by_email(email)
        if existing_user:
            raise ValueError("Email already registered")

        from werkzeug.security import generate_password_hash
        password_hash = generate_password_hash(password)
        user = create_user(username=username, email=email, password_hash=password_hash, role=role)
        return user

    @staticmethod
    def login(email, password, role="user"):
        user = get_user_by_email(email)
        if not user:
            raise ValueError("Invalid email or password")

        if not user.check_password(password):
            raise ValueError("Invalid email or password")

        if user.role != (role or "user").lower():
            raise ValueError("Selected role does not match the account")

        return user


def load_user(user_id):
    from app.db import get_user_by_id
    return get_user_by_id(int(user_id))
