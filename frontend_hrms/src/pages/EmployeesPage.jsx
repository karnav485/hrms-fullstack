import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import EmployeeList from '../components/Employee/EmployeeList';
import EmployeeForm from '../components/Employee/EmployeeForm';
import Modal from '../components/UI/Modal';
import Loader from '../components/UI/Loader';
import ErrorState from '../components/UI/ErrorState';

export default function EmployeesPage() {
    const navigate = useNavigate();
    const { employees, loading, error, fetchEmployees, createEmployee, deleteEmployee } =
        useEmployees();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleAdd = useCallback(async (data) => {
        setIsSubmitting(true);
        const success = await createEmployee(data);
        setIsSubmitting(false);
        if (success) setShowAddModal(false);
    }, [createEmployee]);

    const handleDeleteClick = useCallback((employee) => {
        setSelectedEmployee(employee);
        setShowDeleteModal(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedEmployee) return;
        setIsSubmitting(true);
        await deleteEmployee(selectedEmployee.employee_id);
        setIsSubmitting(false);
        setShowDeleteModal(false);
        setSelectedEmployee(null);
    }, [selectedEmployee, deleteEmployee]);

    const handleViewAttendance = useCallback(
        (employeeId) => {
            navigate(`/attendance?employee=${employeeId}`);
        },
        [navigate]
    );

    if (loading && employees.length === 0) return <Loader text="Loading employees..." />;
    if (error && employees.length === 0)
        return <ErrorState message={error} onRetry={fetchEmployees} />;

    return (
        <div className="page-container fade-in">
            <div className="page-header">
                <div className="page-header-info">
                    <p className="page-description">
                        Manage your organization's employee records
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                    id="add-employee-btn"
                >
                    + Add Employee
                </button>
            </div>

            <EmployeeList
                employees={employees}
                onDelete={handleDeleteClick}
                onViewAttendance={handleViewAttendance}
                onAdd={() => setShowAddModal(true)}
            />

            {/* Add Employee Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Employee"
            >
                <EmployeeForm
                    onSubmit={handleAdd}
                    onCancel={() => setShowAddModal(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Confirm Deletion"
            >
                <div className="delete-confirm">
                    <p className="delete-confirm-text">
                        Are you sure you want to remove{' '}
                        <strong>{selectedEmployee?.full_name}</strong> ({selectedEmployee?.employee_id})?
                    </p>
                    <p className="delete-confirm-warning">
                        This action cannot be undone. All attendance records for this employee will also be deleted.
                    </p>
                    <div className="form-actions">
                        <button
                            className="btn btn-ghost"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleConfirmDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
