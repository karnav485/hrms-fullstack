import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAttendance } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';
import AttendanceForm from '../components/Attendance/AttendanceForm';
import AttendanceTable from '../components/Attendance/AttendanceTable';
import AttendanceFilter from '../components/Attendance/AttendanceFilter';
import Loader from '../components/UI/Loader';
import ErrorState from '../components/UI/ErrorState';

export default function AttendancePage() {
    const [searchParams] = useSearchParams();
    const employeeFromUrl = searchParams.get('employee') || '';

    const { employees, fetchEmployees } = useEmployees();
    const { records, loading, error, fetchAll, fetchByEmployee, markAttendance } =
        useAttendance();

    const [filters, setFilters] = useState({
        employee_id: employeeFromUrl,
        date: '',
        status: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use refs for filter values to avoid the object-reference issue in useEffect
    const filtersRef = useRef(filters);
    filtersRef.current = filters;

    // Fetch employees for dropdowns (runs only once)
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Fetch attendance records when filter values change
    const fetchRecords = useCallback(() => {
        const { employee_id, date, status } = filtersRef.current;
        const params = {};
        if (date) params.date = date;
        if (status) params.status = status;

        if (employee_id) {
            fetchByEmployee(employee_id, params);
        } else {
            fetchAll(params);
        }
    }, [fetchAll, fetchByEmployee]);

    useEffect(() => {
        fetchRecords();
    }, [filters.employee_id, filters.date, filters.status, fetchRecords]);

    const handleMarkAttendance = useCallback(
        async (data) => {
            setIsSubmitting(true);
            const success = await markAttendance(data);
            setIsSubmitting(false);
            if (success) {
                fetchRecords();
            }
            return success;
        },
        [markAttendance, fetchRecords]
    );

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    return (
        <div className="page-container fade-in">
            <div className="page-header">
                <div className="page-header-info">
                    <p className="page-description">
                        Mark and track daily attendance for all employees
                    </p>
                </div>
            </div>

            {/* Mark Attendance Form */}
            <div className="card">
                <AttendanceForm
                    employees={employees}
                    onSubmit={handleMarkAttendance}
                    isSubmitting={isSubmitting}
                />
            </div>

            {/* Filter + Records */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 className="section-title">Attendance Records</h3>
                <AttendanceFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    employees={employees}
                />

                {loading ? (
                    <Loader text="Loading attendance records..." />
                ) : error ? (
                    <ErrorState message={error} onRetry={fetchRecords} />
                ) : (
                    <AttendanceTable
                        records={records}
                        showEmployeeInfo={!filters.employee_id}
                    />
                )}
            </div>
        </div>
    );
}
