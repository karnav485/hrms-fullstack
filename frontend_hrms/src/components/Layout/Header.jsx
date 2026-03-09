import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
    '/': 'Dashboard',
    '/employees': 'Employee Management',
    '/attendance': 'Attendance Tracking',
};

const Header = React.memo(function Header() {
    const { pathname } = useLocation();
    const title = pageTitles[pathname] || 'HRMS Lite';

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="header">
            <div className="header-left">
                <h2 className="header-title">{title}</h2>
                <p className="header-date">{today}</p>
            </div>
            <div className="header-right">
                <div className="header-avatar">
                    <span>A</span>
                </div>
            </div>
        </header>
    );
});

export default Header;
