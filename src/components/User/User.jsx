import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Avatar from '../Avatar';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

const User = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/users/${id}`, { withCredentials: true })
            .then((response) => setUser(response.data))
            .catch((err) => setError(err.message));
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>Loading...</div>;
    console.log(user);
    return (
        <div>
            <h2>User Profile</h2>
            <p>Name: {user.full_name}</p>
            <p>Email: {user.email}</p>
            <Avatar imagePath={ user.profile_picture }/>
        </div>
    );
};

export default User;
