"""
=========================================
AI Grievance Management System
Department Data Model
=========================================
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class Department:
    """
    Represents a government department.
    """

    id: Optional[int] = None

    department_name: str = ""

    description: Optional[str] = None

    created_at: Optional[str] = None