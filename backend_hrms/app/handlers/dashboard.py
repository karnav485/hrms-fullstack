"""Dashboard handler — business logic for dashboard summary."""

from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case

from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.response import APIResponse, DashboardSummary


async def handle_get_dashboard_summary(db: AsyncSession) -> APIResponse:
    """Compute dashboard summary: employee count, today's attendance, and department breakdown."""

    today = date.today()

    # Total employees
    result = await db.execute(select(func.count(Employee.id)))
    total_employees = result.scalar() or 0

    # Today's attendance stats
    result = await db.execute(
        select(
            func.count(case((Attendance.status == "Present", 1))).label("present"),
            func.count(case((Attendance.status == "Absent", 1))).label("absent"),
        ).where(Attendance.date == today)
    )
    row = result.first()
    total_present_today = row.present if row else 0
    total_absent_today = row.absent if row else 0

    # Attendance rate
    attendance_rate = 0.0
    if total_employees > 0:
        attendance_rate = round((total_present_today / total_employees) * 100, 1)

    # Department-wise breakdown
    result = await db.execute(
        select(
            Employee.department,
            func.count(Employee.id).label("count"),
        )
        .group_by(Employee.department)
        .order_by(func.count(Employee.id).desc())
    )
    department_rows = result.all()
    department_breakdown = [
        {"department": dept, "count": count} for dept, count in department_rows
    ]

    summary = DashboardSummary(
        total_employees=total_employees,
        total_present_today=total_present_today,
        total_absent_today=total_absent_today,
        attendance_rate=attendance_rate,
        department_breakdown=department_breakdown,
    )

    return APIResponse(
        success=True,
        message="Dashboard summary retrieved successfully",
        data=summary.model_dump(),
    )
