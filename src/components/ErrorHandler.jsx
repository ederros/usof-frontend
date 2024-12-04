const ErrorHandler = ({ error }) => {
    if (!error) return null;

    return (
        <div style={{ color: 'red', margin: '20px 0' }}>
            <h3>Error</h3>
            <p>{error}</p>
        </div>
    );
};

export default ErrorHandler;
