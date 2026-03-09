import React from 'react';
import EmptyState from '../UI/EmptyState';

const AttendanceTable = React.memo(function AttendanceTable({ records, showEmployeeInfo = true }) {
    if (records.length === 0) {
        return (
            <EmptyState
                icon="📅"
                title="No attendance records"
                description="No attendance records found for the selected filters."
            />
        );
    }

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {showEmployeeInfo && <th>Employee</th>}
                        {showEmployeeInfo && <th>ID</th>}
                        <th>Date</th>
                        <th>Status</th>
                        <th>Recorded At</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.id}>
                            {showEmployeeInfo && <td className="td-name">{record.employee_name}</td>}
                            {showEmployeeInfo && <td className="td-id">{record.employee_id}</td>}
                            <td className="td-date">
                                {new Date(record.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </td>
                            <td>
                                <span className={`status-badge status-${record.status.toLowerCase()}`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className="td-muted">
                                {new Date(record.created_at).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default AttendanceTable;
