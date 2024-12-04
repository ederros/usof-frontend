import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmRegister = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const confirmRegistration = async () => {
            try {
                const response = await axios.post(`/api/auth/register/${token}`);
                
                setMessage(response.data); // "Email confirmed"
                setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
            } catch (err) {
                setError(err.response?.data?.error || 'An error occurred.');
            }
        };

        confirmRegistration();
    }, [token, navigate]);

    return (
        <div>
            <h2>Confirm Registration</h2>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ConfirmRegister;
