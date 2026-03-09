import React from 'react';

const EmptyState = React.memo(function EmptyState({
    icon = '📋',
    title = 'No data found',
    description = 'There is nothing to display here yet.',
    action,
    actionLabel,
}) {
    return (
        <div className="empty-state">
            <span className="empty-state-icon">{icon}</span>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {action && (
                <button className="btn btn-primary" onClick={action}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
});

export default EmptyState;
