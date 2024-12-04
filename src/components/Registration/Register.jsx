import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        login: '',
        password: '',
        passwordConfirmation: '',
        email: '',
        avatar: null,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({ ...prevData, avatar: e.target.files[0] }));
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        try {
            const response = await axios.post('/api/auth/register', data);
            
            setMessage(response.data);
            
        } catch (err) {
            
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="login"
                    placeholder="Login"
                    value={formData.login}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="passwordConfirmation"
                    placeholder="Confirm Password"
                    value={formData.passwordConfirmation}
                    onChange={handleInputChange}
                    required
                />
                <input type="file" name="avatar" onChange={handleFileChange} required />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;
