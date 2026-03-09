import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from '../UI/Loader';

const Layout = React.memo(function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = React.useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = React.useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    return (
        <div className="app-layout">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar} />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="main-area">
                <Header onToggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <Suspense fallback={<Loader text="Loading page..." />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
});

export default Layout;
