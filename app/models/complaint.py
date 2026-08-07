from datetime import datetime


class Complaint:
    def __init__(self, id=None, title="", category="", description="", status="submitted", created_at=None, user_id=None, severity="Medium"):
        self.id = id
        self.title = title
        self.category = category
        self.description = description
        self.status = status
        self.created_at = created_at or datetime.utcnow()
        self.user_id = user_id
        self.severity = severity
