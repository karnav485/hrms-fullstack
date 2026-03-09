"""Pydantic schemas for Employee request/response validation."""

import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

from app.utils.messages import ErrorMessages


class EmployeeCreate(BaseModel):
    """Schema for creating a new employee."""

    employee_id: str
    full_name: str
    email: str
    department: str

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError(ErrorMessages.REQUIRED_FIELD.format("Employee ID"))
        if not re.match(r"^[A-Za-z0-9_-]+$", v):
            raise ValueError(
                "Employee ID can only contain letters, numbers, hyphens, and underscores."
            )
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError(ErrorMessages.REQUIRED_FIELD.format("Full Name"))
        if len(v) < 2:
            raise ValueError(ErrorMessages.NAME_TOO_SHORT)
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not v:
            raise ValueError(ErrorMessages.REQUIRED_FIELD.format("Email"))
        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_pattern, v):
            raise ValueError(ErrorMessages.INVALID_EMAIL)
        return v

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError(ErrorMessages.REQUIRED_FIELD.format("Department"))
        return v


class EmployeeResponse(BaseModel):
    """Schema for employee API responses."""

    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    total_present: Optional[int] = None
    total_absent: Optional[int] = None

    model_config = {"from_attributes": True}
