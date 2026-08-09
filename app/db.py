from app.models.complaint import Complaint
from app.models.user import User


_users = []
_complaints = []
_next_user_id = 1
_next_complaint_id = 1


def init_db():
    return None


def drop_all():
    global _users, _complaints, _next_user_id, _next_complaint_id
    _users = []
    _complaints = []
    _next_user_id = 1
    _next_complaint_id = 1


def create_user(username, email, password_hash, role="user"):
    global _next_user_id

    user = User(
        id=_next_user_id,
        username=username,
        email=email.lower(),
        password_hash=password_hash,
        role=role,
    )
    _users.append(user)
    _next_user_id += 1
    return user


def get_user_by_email(email):
    normalized_email = (email or "").strip().lower()
    for user in _users:
        if user.email == normalized_email:
            return user
    return None


def get_user_by_id(user_id):
    for user in _users:
        if user.id == user_id:
            return user
    return None


def create_complaint(title, category, description, user_id, severity="Medium"):
    global _next_complaint_id

    complaint = Complaint(
        id=_next_complaint_id,
        title=title,
        category=category,
        description=description,
        user_id=user_id,
        severity=severity,
    )
    _complaints.append(complaint)
    _next_complaint_id += 1
    return complaint


def update_complaint_severity(complaint_id, severity):
    for complaint in _complaints:
        if complaint.id == complaint_id:
            complaint.severity = severity
            return complaint
    return None