import React from 'react';

const Loader = React.memo(function Loader({ text = 'Loading...' }) {
    return (
        <div className="loader-container">
            <div className="loader-spinner" />
            <p className="loader-text">{text}</p>
        </div>
    );
});

export default Loader;
