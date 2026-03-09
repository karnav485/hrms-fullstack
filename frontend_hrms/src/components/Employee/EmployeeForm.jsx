import React, { useState, useCallback } from 'react';

const EmployeeForm = React.memo(function EmployeeForm({ onSubmit, onCancel, isSubmitting }) {
    const [form, setForm] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });

    const [errors, setErrors] = useState({});

    const departments = [
        'Engineering',
        'Product',
        'Design',
        'Marketing',
        'Sales',
        'HR',
        'Finance',
        'Operations',
        'Support',
    ];

    const validate = useCallback(() => {
        const newErrors = {};
        if (!form.employee_id.trim()) newErrors.employee_id = 'Employee ID is required';
        if (!form.full_name.trim()) newErrors.full_name = 'Full name is required';
        else if (form.full_name.trim().length < 2) newErrors.full_name = 'Name must be at least 2 characters';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = 'Please enter a valid email address';
        if (!form.department) newErrors.department = 'Department is required';
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
        await onSubmit(form);
    };

    return (
        <form className="employee-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label" htmlFor="employee_id">Employee ID</label>
                <input
                    id="employee_id"
                    className={`form-input${errors.employee_id ? ' form-input-error' : ''}`}
                    type="text"
                    name="employee_id"
                    placeholder="e.g. EMP-001"
                    value={form.employee_id}
                    onChange={handleChange}
                />
                {errors.employee_id && <span className="form-error">{errors.employee_id}</span>}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="full_name">Full Name</label>
                <input
                    id="full_name"
                    className={`form-input${errors.full_name ? ' form-input-error' : ''}`}
                    type="text"
                    name="full_name"
                    placeholder="e.g. John Doe"
                    value={form.full_name}
                    onChange={handleChange}
                />
                {errors.full_name && <span className="form-error">{errors.full_name}</span>}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                    id="email"
                    className={`form-input${errors.email ? ' form-input-error' : ''}`}
                    type="email"
                    name="email"
                    placeholder="e.g. john@company.com"
                    value={form.email}
                    onChange={handleChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="department">Department</label>
                <select
                    id="department"
                    className={`form-input form-select${errors.department ? ' form-input-error' : ''}`}
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
                {errors.department && <span className="form-error">{errors.department}</span>}
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
            </div>
        </form>
    );
});

export default EmployeeForm;
