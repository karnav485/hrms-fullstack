"""Employee API endpoints — thin route layer delegating to handlers."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.employee import EmployeeCreate
from app.schemas.response import APIResponse
from app.utils.decorators import handle_exceptions
from app.handlers.employee import (
    handle_create_employee,
    handle_list_employees,
    handle_get_employee,
    handle_delete_employee,
)

router = APIRouter(prefix="/api/employees", tags=["Employees"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=APIResponse)
@handle_exceptions
async def create_employee(data: EmployeeCreate, db: AsyncSession = Depends(get_db)):
    """Add a new employee to the system."""
    return await handle_create_employee(data, db)


@router.get("", response_model=APIResponse)
@handle_exceptions
async def list_employees(db: AsyncSession = Depends(get_db)):
    """Retrieve all employees with their attendance summary."""
    return await handle_list_employees(db)


@router.get("/{employee_id}", response_model=APIResponse)
@handle_exceptions
async def get_employee(employee_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single employee by their Employee ID."""
    return await handle_get_employee(employee_id, db)


@router.delete("/{employee_id}", response_model=APIResponse)
@handle_exceptions
async def delete_employee(employee_id: str, db: AsyncSession = Depends(get_db)):
    """Delete an employee and their attendance records."""
    return await handle_delete_employee(employee_id, db)
