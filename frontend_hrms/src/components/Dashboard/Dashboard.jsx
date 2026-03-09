import React from 'react';

const statCardConfig = [
    {
        key: 'total_employees',
        label: 'Total Employees',
        icon: '👥',
        color: 'var(--accent-primary)',
        bgColor: 'var(--accent-primary-glow)',
    },
    {
        key: 'total_present_today',
        label: 'Present Today',
        icon: '✅',
        color: 'var(--accent-success)',
        bgColor: 'var(--accent-success-bg)',
    },
    {
        key: 'total_absent_today',
        label: 'Absent Today',
        icon: '❌',
        color: 'var(--accent-danger)',
        bgColor: 'var(--accent-danger-bg)',
    },
    {
        key: 'attendance_rate',
        label: 'Attendance Rate',
        icon: '📈',
        color: 'var(--accent-secondary)',
        bgColor: 'var(--accent-secondary-glow)',
        suffix: '%',
    },
];

const DashboardCards = React.memo(function DashboardCards({ summary }) {
    return (
        <div className="dashboard-stats">
            {statCardConfig.map((card, index) => (
                <div
                    key={card.key}
                    className="stat-card"
                    style={{
                        '--card-color': card.color,
                        '--card-bg': card.bgColor,
                        animationDelay: `${index * 100}ms`,
                    }}
                >
                    <div className="stat-card-icon">{card.icon}</div>
                    <div className="stat-card-info">
                        <span className="stat-card-value">
                            {summary?.[card.key] ?? '—'}
                            {card.suffix && summary?.[card.key] != null ? card.suffix : ''}
                        </span>
                        <span className="stat-card-label">{card.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
});

const DepartmentTable = React.memo(function DepartmentTable({ departments }) {
    if (!departments || departments.length === 0) return null;

    const total = departments.reduce((sum, d) => sum + d.count, 0);

    return (
        <div className="department-section">
            <h3 className="section-title">Department Breakdown</h3>
            <div className="department-list">
                {departments.map((dept, index) => {
                    const percentage = total > 0 ? ((dept.count / total) * 100).toFixed(1) : 0;
                    return (
                        <div key={dept.department} className="department-item" style={{ animationDelay: `${index * 80}ms` }}>
                            <div className="department-info">
                                <span className="department-name">{dept.department}</span>
                                <span className="department-count">{dept.count} employees</span>
                            </div>
                            <div className="department-bar-track">
                                <div
                                    className="department-bar-fill"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="department-percentage">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export { DashboardCards, DepartmentTable };
