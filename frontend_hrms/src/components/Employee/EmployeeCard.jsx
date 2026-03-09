import React from 'react';

const EmployeeCard = React.memo(function EmployeeCard({ employee, onDelete, onViewAttendance }) {
    return (
        <div className="employee-card">
            <div className="employee-card-header">
                <div className="employee-avatar">
                    {employee.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="employee-info">
                    <h3 className="employee-name">{employee.full_name}</h3>
                    <span className="employee-id">{employee.employee_id}</span>
                </div>
            </div>

            <div className="employee-card-body">
                <div className="employee-detail">
                    <span className="employee-detail-label">Email</span>
                    <span className="employee-detail-value">{employee.email}</span>
                </div>
                <div className="employee-detail">
                    <span className="employee-detail-label">Department</span>
                    <span className="employee-badge">{employee.department}</span>
                </div>
                <div className="employee-stats">
                    <div className="employee-stat present">
                        <span className="employee-stat-value">{employee.total_present ?? 0}</span>
                        <span className="employee-stat-label">Present</span>
                    </div>
                    <div className="employee-stat absent">
                        <span className="employee-stat-value">{employee.total_absent ?? 0}</span>
                        <span className="employee-stat-label">Absent</span>
                    </div>
                </div>
            </div>

            <div className="employee-card-actions">
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => onViewAttendance(employee.employee_id)}
                >
                    📅 Attendance
                </button>
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(employee)}
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
});

export default EmployeeCard;
