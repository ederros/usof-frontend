import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const EditUser = () => {
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
    const [isEditMode, setIsEditMode] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const token = useSelector((state) => state.auth.user ? jwtDecode(state.auth.user.jwt) : null);

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        if (id) {
            axios
                .get(`/api/users/${id}`)
                .then((response) => {
                    const { full_name, login, email, avatar } = response.data;
                    setFormData({
                        fullName: full_name || '',
                        login: login || '',
                        email: email || '',
                        avatar: avatar || null, 
                    });
                })
                .catch(() => setError('Failed to fetch user data.'));
        }
    }, []);

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
        Object.keys(formData).forEach((key) => {
            if (formData[key]) data.append(key, formData[key]);
        });
        
        try {
            console.log(data);
            const response = await axios.patch(`/api/users/${id}`, data, { withCredentials: true });
            setMessage(isEditMode ? 'User updated successfully.' : 'User registered successfully.');
            navigate(`/users/${id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };


    if (!token || (isEditMode && token.id !== Number(id) && token.role !== 'admin')) {
        return <div>Unauthorized access.</div>;
    }

    return (
        <div>
            <h2 className="dark-text">Edit User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="login"
                    value={formData.login}
                    placeholder="New login"
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    placeholder="Full Name"
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="New email"
                    onChange={handleInputChange}
                    required
                />
                
                <input
                    type="file"
                    name="avatar"
                    onChange={handleFileChange}
                />
                <button type="submit">{isEditMode ? 'Save Changes' : 'Register'}</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default EditUser;
