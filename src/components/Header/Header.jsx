import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { logout } from '../../slices/authSlice';
import { fetchCategories } from '../../slices/categorySlice';
import { persistStore } from 'redux-persist';
import { store } from '../../store/index';
import Avatar from '../Avatar';
import '../../styles/Header.css';

function Header({ }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const token = user?.jwt ? jwtDecode(user.jwt) : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    dispatch(logout());
    dispatch(fetchCategories());
    persistStore(store).purge();
    setProfile(null);
    navigate('/');
  };

  const fetchUserProfile = async () => {
    if (!token) return setProfile(null);

    try {
      if (token.exp < Date.now() / 1000) {
        logoutUser();
        return;
      }

      const { data } = await axios.get(`/api/users/${token.id}`, { withCredentials: true });
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      logoutUser();
    }
  };

  useEffect(() => {
    fetchUserProfile();
    console.log(token);
  }, [user]);

  return (
    <header className="header">
      <div className="logo">
        <h1>USOF</h1>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        {error && <div className="error-message">{error}</div>}
        {profile ? (
          <>
            <div className="nav-user-info">
              <Link to="/profile" className="nav-link">
                <Avatar imagePath={profile.profile_picture} alt={profile.login} />
              </Link>
              <div className="nav-user-details">
                <span className="nav-user-nickname">{profile.login}</span>
                <span className="nav-user-role">({profile.role})</span>
              </div>
            </div>
            <button className="nav-link logout-btn" onClick={logoutUser}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
