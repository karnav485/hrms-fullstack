import React from 'react';

const AttendanceFilter = React.memo(function AttendanceFilter({
    filters,
    onFilterChange,
    employees,
    showEmployeeFilter = true,
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    const handleClear = () => {
        onFilterChange({ employee_id: '', date: '', status: '' });
    };

    const hasActiveFilters = filters.employee_id || filters.date || filters.status;

    return (
        <div className="filter-bar">
            <div className="filter-controls">
                {showEmployeeFilter && (
                    <div className="filter-group">
                        <label className="filter-label">Employee</label>
                        <select
                            className="form-input form-select filter-select"
                            name="employee_id"
                            value={filters.employee_id || ''}
                            onChange={handleChange}
                        >
                            <option value="">All Employees</option>
                            {employees?.map((emp) => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.full_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="filter-group">
                    <label className="filter-label">Date</label>
                    <input
                        type="date"
                        className="form-input filter-input"
                        name="date"
                        value={filters.date || ''}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Status</label>
                    <select
                        className="form-input form-select filter-select"
                        name="status"
                        value={filters.status || ''}
                        onChange={handleChange}
                    >
                        <option value="">All Status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>

                {hasActiveFilters && (
                    <button className="btn btn-ghost btn-sm filter-clear" onClick={handleClear}>
                        ✕ Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
});

export default AttendanceFilter;
