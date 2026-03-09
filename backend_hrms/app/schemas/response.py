"""Unified response schemas for consistent API responses."""

from typing import Any, Optional
from pydantic import BaseModel


class APIResponse(BaseModel):
    """Standard API response wrapper."""

    success: bool
    message: str
    data: Optional[Any] = None


class DashboardSummary(BaseModel):
    """Dashboard summary statistics."""

    total_employees: int
    total_present_today: int
    total_absent_today: int
    attendance_rate: float
    department_breakdown: list[dict]
