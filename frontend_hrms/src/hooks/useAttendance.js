import { useState, useCallback, useRef } from 'react';
import { attendanceAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

export function useAttendance() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();
    const toastRef = useRef(toast);
    toastRef.current = toast;

    const fetchByEmployee = useCallback(async (employeeId, params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await attendanceAPI.getByEmployee(employeeId, params);
            setRecords(response.data || []);
        } catch (err) {
            setError(err.message);
            toastRef.current.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAll = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await attendanceAPI.getAll(params);
            setRecords(response.data || []);
        } catch (err) {
            setError(err.message);
            toastRef.current.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAttendance = useCallback(async (data) => {
        try {
            const response = await attendanceAPI.markAttendance(data);
            toastRef.current.success(response.message);
            return true;
        } catch (err) {
            toastRef.current.error(err.message);
            return false;
        }
    }, []);

    return {
        records,
        loading,
        error,
        fetchByEmployee,
        fetchAll,
        markAttendance,
    };
}
