import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import '../../styles/Favorites.css'; // Assuming you have a CSS file for this component

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.user ? jwtDecode(state.auth.user.jwt) : null);

  useEffect(() => {
    if (token) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get('/api/favorites', { withCredentials: true });
          setFavorites(response.data);
        } catch (err) {
          setError('Failed to load favorite posts.');
        }
      };
      fetchFavorites();
    }
  }, [token]);

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Favorite Posts</h2>
      {error && <p className="favorites-error">{error}</p>}
      <ul className="favorites-list">
        {favorites.length > 0 ? (
          favorites.map((post) => (
            <li key={post.id} className="favorites-item">
              <Link to={`/posts/${post.id}`} className="favorites-link">
                {post.title}
              </Link>
            </li>
          ))
        ) : (
          <p className="favorites-message">
            {token
              ? 'No favorite posts yet.'
              : 'You must be logged in to view favorite posts.'}
          </p>
        )}
      </ul>
    </div>
  );
};

export default Favorites;
