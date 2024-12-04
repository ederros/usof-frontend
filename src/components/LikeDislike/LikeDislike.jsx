import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const LikeDislike = ({ id, type}) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [myLike, setMyLike] = useState(null);

    // Memoize the decoded token to avoid unnecessary re-renders
    const token = useSelector((state) => state.auth.user);
    
    const decodedToken = useMemo(() => {
        return token ? jwtDecode(token.jwt) : null;
    }, [token]);

    useEffect(() => {
        if (decodedToken) {
            axios.get(`/api/${type}s/${id}`)
                .then((response) => {
                    setLikes(response.data.likes_count);
                    setDislikes(response.data.dislikes_count);
                })
                .catch(() => setError('Failed to load data.'));

            axios.get(`/api/${type}s/${id}/myLike`)
                .then((response) => {
                    setMyLike(response.data?.type); // can be 'like', 'dislike', or null
                })
                .catch(() => setError('Failed to load data.'));
        }
    }, [id, loading, type, decodedToken]);

    const handleLike = () => {
        setLoading(true);
        axios.post(`/api/${type}s/${id}/like`, { type: 'like' })
            .then(() => {
                setLikes(likes + 1);
                setMyLike('like');
                setLoading(false);
            })
            .catch(() => {
                setError('Error adding like');
                setLoading(false);
            });
        window.location.reload();
    };

    const handleDislike = () => {
        setLoading(true);
        axios.post(`/api/${type}s/${id}/like`, { type: 'dislike' })
            .then(() => {
                setDislikes(dislikes + 1);
                setMyLike('dislike');
                setLoading(false);
            })
            .catch(() => {
                setError('Error adding dislike');
                setLoading(false);
            });
        window.location.reload();
    };

    return (
        <div className="like-dislike">
            {error && <div className="error-message">{error}</div>}
            {decodedToken && (
                <>
                    <button
                        onClick={handleLike}
                        className={`like-btn ${loading ? 'loading' : ''} ${myLike === 'like' ? 'liked' : ''}`}
                    >
                        Like ({likes})
                    </button>
                    <button
                        onClick={handleDislike}
                        className={`dislike-btn ${loading ? 'loading' : ''} ${myLike === 'dislike' ? 'disliked' : ''}`}
                    >
                        Dislike ({dislikes})
                    </button>
                </>
            )}
        </div>
    );
};

export default LikeDislike;
