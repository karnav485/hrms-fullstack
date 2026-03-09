import { useState, useCallback, useRef } from 'react';
import { employeeAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

export function useEmployees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();
    const toastRef = useRef(toast);
    toastRef.current = toast;

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await employeeAPI.getAll();
            setEmployees(response.data || []);
        } catch (err) {
            setError(err.message);
            toastRef.current.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createEmployee = useCallback(async (data) => {
        try {
            const response = await employeeAPI.create(data);
            toastRef.current.success(response.message);
            await fetchEmployees();
            return true;
        } catch (err) {
            toastRef.current.error(err.message);
            return false;
        }
    }, [fetchEmployees]);

    const deleteEmployee = useCallback(async (employeeId) => {
        try {
            const response = await employeeAPI.delete(employeeId);
            toastRef.current.success(response.message);
            await fetchEmployees();
            return true;
        } catch (err) {
            toastRef.current.error(err.message);
            return false;
        }
    }, [fetchEmployees]);

    return {
        employees,
        loading,
        error,
        fetchEmployees,
        createEmployee,
        deleteEmployee,
    };
}
