import React, { useState, useCallback } from 'react';

const AttendanceForm = React.memo(function AttendanceForm({
    employees,
    onSubmit,
    isSubmitting,
}) {
    const [form, setForm] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: '',
    });

    const [errors, setErrors] = useState({});

    const validate = useCallback(() => {
        const newErrors = {};
        if (!form.employee_id) newErrors.employee_id = 'Please select an employee';
        if (!form.date) newErrors.date = 'Please select a date';
        else if (new Date(form.date) > new Date()) newErrors.date = 'Cannot mark attendance for a future date';
        if (!form.status) newErrors.status = 'Please select a status';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const success = await onSubmit(form);
        if (success) {
            setForm((prev) => ({ ...prev, employee_id: '', status: '' }));
        }
    };

    return (
        <form className="attendance-form" onSubmit={handleSubmit}>
            <h3 className="form-section-title">Mark Attendance</h3>

            <div className="attendance-form-grid">
                <div className="form-group">
                    <label className="form-label" htmlFor="att_employee">Employee</label>
                    <select
                        id="att_employee"
                        className={`form-input form-select${errors.employee_id ? ' form-input-error' : ''}`}
                        name="employee_id"
                        value={form.employee_id}
                        onChange={handleChange}
                    >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                            <option key={emp.employee_id} value={emp.employee_id}>
                                {emp.full_name} ({emp.employee_id})
                            </option>
                        ))}
                    </select>
                    {errors.employee_id && <span className="form-error">{errors.employee_id}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="att_date">Date</label>
                    <input
                        id="att_date"
                        type="date"
                        className={`form-input${errors.date ? ' form-input-error' : ''}`}
                        name="date"
                        value={form.date}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                    />
                    {errors.date && <span className="form-error">{errors.date}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Status</label>
                    <div className="status-toggle">
                        <button
                            type="button"
                            className={`status-btn status-present${form.status === 'Present' ? ' active' : ''}`}
                            onClick={() => {
                                setForm((prev) => ({ ...prev, status: 'Present' }));
                                setErrors((prev) => ({ ...prev, status: '' }));
                            }}
                        >
                            ✓ Present
                        </button>
                        <button
                            type="button"
                            className={`status-btn status-absent${form.status === 'Absent' ? ' active' : ''}`}
                            onClick={() => {
                                setForm((prev) => ({ ...prev, status: 'Absent' }));
                                setErrors((prev) => ({ ...prev, status: '' }));
                            }}
                        >
                            ✕ Absent
                        </button>
                    </div>
                    {errors.status && <span className="form-error">{errors.status}</span>}
                </div>

                <div className="form-group form-group-action">
                    <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Marking...' : 'Mark Attendance'}
                    </button>
                </div>
            </div>
        </form>
    );
});

export default AttendanceForm;
