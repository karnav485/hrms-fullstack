import React, { useState, useMemo, useCallback } from 'react';
import EmployeeCard from './EmployeeCard';
import EmptyState from '../UI/EmptyState';

const EmployeeList = React.memo(function EmployeeList({
    employees,
    onDelete,
    onViewAttendance,
    onAdd,
}) {
    const [search, setSearch] = useState('');

    const filteredEmployees = useMemo(() => {
        if (!search.trim()) return employees;
        const query = search.toLowerCase();
        return employees.filter(
            (emp) =>
                emp.full_name.toLowerCase().includes(query) ||
                emp.employee_id.toLowerCase().includes(query) ||
                emp.email.toLowerCase().includes(query) ||
                emp.department.toLowerCase().includes(query)
        );
    }, [employees, search]);

    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    if (employees.length === 0) {
        return (
            <EmptyState
                icon="👥"
                title="No employees yet"
                description="Get started by adding your first employee to the system."
                action={onAdd}
                actionLabel="+ Add Employee"
            />
        );
    }

    return (
        <div className="employee-list-container">
            <div className="employee-list-toolbar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search employees by name, ID, email, or department..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>
                <span className="employee-count">
                    {filteredEmployees.length} of {employees.length} employee(s)
                </span>
            </div>

            {filteredEmployees.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No matches found"
                    description={`No employees match "${search}". Try a different search term.`}
                />
            ) : (
                <div className="employee-grid">
                    {filteredEmployees.map((emp) => (
                        <EmployeeCard
                            key={emp.employee_id}
                            employee={emp}
                            onDelete={onDelete}
                            onViewAttendance={onViewAttendance}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default EmployeeList;
