import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Response interceptor — extract data or throw user-friendly errors
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            const { data, status } = error.response;

            // Handle validation errors (422)
            if (status === 422 && data?.data) {
                const messages = Array.isArray(data.data)
                    ? data.data.join('\n')
                    : data.detail || 'Validation failed';
                return Promise.reject(new Error(messages));
            }

            // Handle other API errors with user-friendly messages
            const message =
                data?.detail || data?.message || 'Something went wrong. Please try again.';
            return Promise.reject(new Error(message));
        }

        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Request timed out. Please try again.'));
        }

        return Promise.reject(
            new Error('Unable to connect to the server. Please check your connection.')
        );
    }
);

// ---- Employee APIs ----
export const employeeAPI = {
    getAll: () => api.get('/api/employees'),
    getById: (employeeId) => api.get(`/api/employees/${employeeId}`),
    create: (data) => api.post('/api/employees', data),
    delete: (employeeId) => api.delete(`/api/employees/${employeeId}`),
};

// ---- Attendance APIs ----
export const attendanceAPI = {
    markAttendance: (data) => api.post('/api/attendance', data),
    getByEmployee: (employeeId, params = {}) =>
        api.get(`/api/attendance/${employeeId}`, { params }),
    getAll: (params = {}) => api.get('/api/attendance', { params }),
};

// ---- Dashboard APIs ----
export const dashboardAPI = {
    getSummary: () => api.get('/api/dashboard/summary'),
};

export default api;
