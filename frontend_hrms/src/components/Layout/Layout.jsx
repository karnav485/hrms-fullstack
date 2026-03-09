import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from '../UI/Loader';

const Layout = React.memo(function Layout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-area">
                <Header />
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
