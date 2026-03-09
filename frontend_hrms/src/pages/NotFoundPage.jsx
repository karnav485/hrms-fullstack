import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="page-container fade-in">
            <div className="empty-state" style={{ minHeight: '60vh' }}>
                <span className="empty-state-icon" style={{ fontSize: '4rem' }}>🔍</span>
                <h1 className="empty-state-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    Page Not Found
                </h1>
                <p className="empty-state-description">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
