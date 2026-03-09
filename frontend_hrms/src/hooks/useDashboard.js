import { useState, useCallback, useRef } from 'react';
import { dashboardAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

export function useDashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();
    const toastRef = useRef(toast);
    toastRef.current = toast;

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await dashboardAPI.getSummary();
            setSummary(response.data);
        } catch (err) {
            setError(err.message);
            toastRef.current.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { summary, loading, error, fetchSummary };
}
