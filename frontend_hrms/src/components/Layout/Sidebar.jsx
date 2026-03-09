import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/employees', icon: '👥', label: 'Employees' },
    { to: '/attendance', icon: '📅', label: 'Attendance' },
];

const Sidebar = React.memo(function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-icon">💼</span>
                </div>
                <div className="sidebar-brand-text">
                    <h1 className="sidebar-title">HRMS</h1>
                    <span className="sidebar-subtitle">Lite</span>
                </div>
            </div>

            <nav className="sidebar-nav" role="navigation">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? ' sidebar-link-active' : ''}`
                        }
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        <span className="sidebar-link-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-footer-info">
                    <span className="sidebar-footer-dot" />
                    <span>Admin Panel</span>
                </div>
            </div>
        </aside>
    );
});

export default Sidebar;
