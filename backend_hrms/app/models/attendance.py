from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Attendance(Base):
    """Attendance ORM model."""

    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_db_id = Column(
        Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False
    )
    date = Column(Date, nullable=False)
    status = Column(String(10), nullable=False)  # "Present" or "Absent"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to employee
    employee = relationship("Employee", back_populates="attendance_records")

    # Unique constraint: one attendance record per employee per day
    __table_args__ = (
        UniqueConstraint("employee_db_id", "date", name="uq_employee_date"),
    )

    def __repr__(self):
        return f"<Attendance(employee_id={self.employee_db_id}, date='{self.date}', status='{self.status}')>"
