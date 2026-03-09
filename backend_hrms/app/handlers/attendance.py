"""Attendance handler — all business logic for attendance operations."""

from datetime import date
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceResponse
from app.schemas.response import APIResponse
from app.utils.messages import SuccessMessages, ErrorMessages


async def handle_mark_attendance(data: AttendanceCreate, db: AsyncSession) -> APIResponse:
    """Mark attendance for an employee on a specific date."""

    # Find the employee by business ID
    result = await db.execute(
        select(Employee).where(Employee.employee_id == data.employee_id)
    )
    employee = result.scalar_one_or_none()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorMessages.EMPLOYEE_NOT_FOUND.format(data.employee_id),
        )

    # Check if attendance already marked for this employee on this date
    result = await db.execute(
        select(Attendance).where(
            and_(
                Attendance.employee_db_id == employee.id,
                Attendance.date == data.date,
            )
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ErrorMessages.ATTENDANCE_EXISTS.format(
                employee.full_name, data.date.isoformat()
            ),
        )

    # Create attendance record
    attendance = Attendance(
        employee_db_id=employee.id,
        date=data.date,
        status=data.status,
    )
    db.add(attendance)
    await db.commit()
    await db.refresh(attendance)

    response_data = AttendanceResponse(
        id=attendance.id,
        employee_id=employee.employee_id,
        employee_name=employee.full_name,
        date=attendance.date,
        status=attendance.status,
        created_at=attendance.created_at,
    )

    return APIResponse(
        success=True,
        message=SuccessMessages.ATTENDANCE_MARKED.format(
            data.status, employee.full_name, data.date.isoformat()
        ),
        data=response_data.model_dump(),
    )


async def handle_get_employee_attendance(
    employee_id: str,
    filter_date: Optional[date],
    filter_status: Optional[str],
    db: AsyncSession,
) -> APIResponse:
    """Get attendance records for a specific employee with optional filters."""

    # Verify employee exists
    result = await db.execute(
        select(Employee).where(Employee.employee_id == employee_id)
    )
    employee = result.scalar_one_or_none()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorMessages.EMPLOYEE_NOT_FOUND.format(employee_id),
        )

    # Build query with optional filters
    stmt = select(Attendance).where(Attendance.employee_db_id == employee.id)

    if filter_date:
        stmt = stmt.where(Attendance.date == filter_date)
    if filter_status:
        stmt = stmt.where(Attendance.status == filter_status.capitalize())

    stmt = stmt.order_by(Attendance.date.desc())
    result = await db.execute(stmt)
    records = result.scalars().all()

    attendance_list = [
        AttendanceResponse(
            id=record.id,
            employee_id=employee.employee_id,
            employee_name=employee.full_name,
            date=record.date,
            status=record.status,
            created_at=record.created_at,
        ).model_dump()
        for record in records
    ]

    return APIResponse(
        success=True,
        message=f"Found {len(attendance_list)} attendance record(s) for '{employee.full_name}'",
        data=attendance_list,
    )


async def handle_get_all_attendance(
    filter_date: Optional[date],
    filter_status: Optional[str],
    db: AsyncSession,
) -> APIResponse:
    """Get all attendance records with optional date/status filters."""

    stmt = (
        select(Attendance, Employee)
        .join(Employee, Attendance.employee_db_id == Employee.id)
    )

    if filter_date:
        stmt = stmt.where(Attendance.date == filter_date)
    if filter_status:
        stmt = stmt.where(Attendance.status == filter_status.capitalize())

    stmt = stmt.order_by(Attendance.date.desc(), Employee.full_name.asc())
    result = await db.execute(stmt)
    rows = result.all()

    attendance_list = [
        AttendanceResponse(
            id=attendance.id,
            employee_id=employee.employee_id,
            employee_name=employee.full_name,
            date=attendance.date,
            status=attendance.status,
            created_at=attendance.created_at,
        ).model_dump()
        for attendance, employee in rows
    ]

    return APIResponse(
        success=True,
        message=f"Found {len(attendance_list)} attendance record(s)",
        data=attendance_list,
    )
