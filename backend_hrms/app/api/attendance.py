"""Attendance API endpoints — thin route layer delegating to handlers."""

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.attendance import AttendanceCreate
from app.schemas.response import APIResponse
from app.utils.decorators import handle_exceptions
from app.handlers.attendance import (
    handle_mark_attendance,
    handle_get_employee_attendance,
    handle_get_all_attendance,
)

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse)
@handle_exceptions
async def mark_attendance(data: AttendanceCreate, db: AsyncSession = Depends(get_db)):
    """Mark attendance for an employee on a specific date."""
    return await handle_mark_attendance(data, db)


@router.get("/{employee_id}", response_model=APIResponse)
@handle_exceptions
async def get_employee_attendance(
    employee_id: str,
    filter_date: Optional[date] = Query(None, alias="date", description="Filter by specific date (YYYY-MM-DD)"),
    filter_status: Optional[str] = Query(None, alias="status", description="Filter by status (Present/Absent)"),
    db: AsyncSession = Depends(get_db),
):
    """Get attendance records for a specific employee with optional filters."""
    return await handle_get_employee_attendance(employee_id, filter_date, filter_status, db)


@router.get("", response_model=APIResponse)
@handle_exceptions
async def get_all_attendance(
    filter_date: Optional[date] = Query(None, alias="date", description="Filter by specific date (YYYY-MM-DD)"),
    filter_status: Optional[str] = Query(None, alias="status", description="Filter by status (Present/Absent)"),
    db: AsyncSession = Depends(get_db),
):
    """Get all attendance records with optional date/status filters."""
    return await handle_get_all_attendance(filter_date, filter_status, db)
