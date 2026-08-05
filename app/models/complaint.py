"""
=========================================
AI Grievance Management System
Complaint Data Model
=========================================
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class Complaint:
    """
    Complaint Data Model

    This class represents a complaint object throughout
    the application.

    It does not communicate with the database directly.
    Database operations are handled by services.
    """

    id: Optional[int] = None

    user_id: Optional[int] = None

    title: str = ""

    description: str = ""

    image_path: Optional[str] = None

    category: Optional[str] = None

    priority: Optional[str] = None

    department_id: Optional[int] = None

    status: str = "Pending"

    location: Optional[str] = None

    latitude: Optional[float] = None

    longitude: Optional[float] = None

    created_at: Optional[str] = None

    updated_at: Optional[str] = None