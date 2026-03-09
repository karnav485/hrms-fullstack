import { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardCards, DepartmentTable } from '../components/Dashboard/Dashboard';
import Loader from '../components/UI/Loader';
import ErrorState from '../components/UI/ErrorState';

export default function DashboardPage() {
    const { summary, loading, error, fetchSummary } = useDashboard();

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    if (loading && !summary) return <Loader text="Loading dashboard..." />;
    if (error && !summary) return <ErrorState message={error} onRetry={fetchSummary} />;

    return (
        <div className="page-container fade-in">
            <DashboardCards summary={summary} />
            <DepartmentTable departments={summary?.department_breakdown} />
        </div>
    );
}
