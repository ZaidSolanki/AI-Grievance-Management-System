from app.models.user import User


class Admin(User):
    __tablename__ = "admins"

    id = User.id
