import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import persistStore from 'redux-persist/es/persistStore';
import { store } from '../../store';
import Avatar from '../Avatar';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.user ? jwtDecode(state.auth.user.jwt) : null);    

    useEffect(() => {
        const getUserIdFromToken = () => {
            try {
                if (!token) {
                    const persistor = persistStore(store);
                    persistor.purge();
                    navigate('/');
                    return null;
                }
                return token.id;
            } catch (err) {
                setError(err.message);
                return null;
            }
        };

        const userId = id || getUserIdFromToken();
        if (!userId) return;

        axios
            .get(`/api/users/${userId}`, { withCredentials: true })
            .then((response) => setProfile(response.data))
            .catch((err) => setError(err.message));
    }, [id, token]);

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        axios
            .delete(`/api/users/${profile.id}`, { withCredentials: true,
                params: { id: profile.id },
             })
            .then(() => {
                alert('User deleted successfully');
                navigate('/');
            })
            .catch(() => setError('Failed to delete user'));
    };

    const handleEdit = () => {
        navigate(`/users/${profile.id}/edit`);
    };

    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Loading...</div>;

    const isAdminOrOwner = token && (token.role === 'admin' || token.id === profile.id);

    return (
        <div className="dark-text">
            <h2 className="dark-text">Profile</h2>
            <p className="dark-text">Name: {profile.full_name}</p>
            <p className="dark-text">Login: {profile.login}</p>
            <p className="dark-text">Email: {profile.email}</p>
            <Avatar imagePath={profile.profile_picture} />
            {profile.role === 'admin' && <p className="dark-text">Role: {profile.role}</p>}

            {isAdminOrOwner && (
                <div>
                    <button onClick={handleEdit} className="edit-btn">
                        Edit Profile
                    </button>
                    <button onClick={handleDelete} className="delete-btn">
                        Delete Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
