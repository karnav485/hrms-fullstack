"""Employee handler — all business logic for employee operations."""

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case

from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.schemas.response import APIResponse
from app.utils.messages import SuccessMessages, ErrorMessages


async def handle_create_employee(data: EmployeeCreate, db: AsyncSession) -> APIResponse:
    """Create a new employee after checking for duplicates."""

    # Check if employee_id already exists
    result = await db.execute(
        select(Employee).where(Employee.employee_id == data.employee_id)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ErrorMessages.EMPLOYEE_ID_EXISTS.format(data.employee_id),
        )

    # Check if email already exists
    result = await db.execute(
        select(Employee).where(Employee.email == data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ErrorMessages.EMAIL_EXISTS.format(data.email),
        )

    # Create and persist the employee
    employee = Employee(
        employee_id=data.employee_id,
        full_name=data.full_name,
        email=data.email,
        department=data.department,
    )
    db.add(employee)
    await db.commit()
    await db.refresh(employee)

    return APIResponse(
        success=True,
        message=SuccessMessages.EMPLOYEE_CREATED.format(data.full_name),
        data=EmployeeResponse.model_validate(employee).model_dump(),
    )


async def handle_list_employees(db: AsyncSession) -> APIResponse:
    """Retrieve all employees with their attendance summary (present/absent counts)."""

    stmt = (
        select(
            Employee,
            func.count(case((Attendance.status == "Present", 1))).label("total_present"),
            func.count(case((Attendance.status == "Absent", 1))).label("total_absent"),
        )
        .outerjoin(Attendance, Employee.id == Attendance.employee_db_id)
        .group_by(Employee.id)
        .order_by(Employee.created_at.desc())
    )

    result = await db.execute(stmt)
    rows = result.all()

    employees = []
    for emp, total_present, total_absent in rows:
        emp_data = EmployeeResponse.model_validate(emp)
        emp_data.total_present = total_present
        emp_data.total_absent = total_absent
        employees.append(emp_data.model_dump())

    return APIResponse(
        success=True,
        message=f"Found {len(employees)} employee(s)",
        data=employees,
    )


async def handle_get_employee(employee_id: str, db: AsyncSession) -> APIResponse:
    """Get a single employee by their business Employee ID with attendance stats."""

    stmt = (
        select(
            Employee,
            func.count(case((Attendance.status == "Present", 1))).label("total_present"),
            func.count(case((Attendance.status == "Absent", 1))).label("total_absent"),
        )
        .outerjoin(Attendance, Employee.id == Attendance.employee_db_id)
        .where(Employee.employee_id == employee_id)
        .group_by(Employee.id)
    )

    result = await db.execute(stmt)
    row = result.first()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorMessages.EMPLOYEE_NOT_FOUND.format(employee_id),
        )

    emp, total_present, total_absent = row
    emp_data = EmployeeResponse.model_validate(emp)
    emp_data.total_present = total_present
    emp_data.total_absent = total_absent

    return APIResponse(
        success=True,
        message=f"Employee '{emp.full_name}' found",
        data=emp_data.model_dump(),
    )


async def handle_delete_employee(employee_id: str, db: AsyncSession) -> APIResponse:
    """Delete an employee and all their attendance records (cascade)."""

    result = await db.execute(
        select(Employee).where(Employee.employee_id == employee_id)
    )
    employee = result.scalar_one_or_none()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorMessages.EMPLOYEE_NOT_FOUND.format(employee_id),
        )

    employee_name = employee.full_name
    await db.delete(employee)
    await db.commit()

    return APIResponse(
        success=True,
        message=SuccessMessages.EMPLOYEE_DELETED.format(employee_name),
        data=None,
    )
