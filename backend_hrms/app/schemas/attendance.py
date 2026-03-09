"""Pydantic schemas for Attendance request/response validation."""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, field_validator

from app.utils.messages import ErrorMessages


class AttendanceCreate(BaseModel):
    """Schema for marking attendance."""

    employee_id: str  # Business employee ID, not DB id
    date: date
    status: str

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError(ErrorMessages.REQUIRED_FIELD.format("Employee ID"))
        return v

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: date) -> date:
        if v > date.today():
            raise ValueError(ErrorMessages.FUTURE_DATE)
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        v = v.strip().capitalize()
        if v not in ("Present", "Absent"):
            raise ValueError(ErrorMessages.INVALID_STATUS)
        return v


class AttendanceResponse(BaseModel):
    """Schema for attendance API responses."""

    id: int
    employee_id: str
    employee_name: str
    date: date
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AttendanceFilter(BaseModel):
    """Schema for filtering attendance records."""

    date: Optional[date] = None
    status: Optional[str] = None
