import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const Sidebar = () => {
  const token = useSelector((state) => state.auth.user ? jwtDecode(state.auth.user.jwt) : null);
  return (
    <aside className="sidebar">
      {!token && <p>Login to use sidebar features</p>}
      <ul className="sidebar-list">
        <li className="sidebar-item">
          {token ? <Link to="/create-post" className="sidebar-link">Create Post</Link> : <p className="sidebar-inactive">Create Post</p>}
        </li>
        <li className="sidebar-item">
          {token ? <Link to="/favorites" className="sidebar-link">Favorite Posts</Link> : <p className="sidebar-inactive">Favorite Posts</p>}
        </li>
        <li className="sidebar-item">
          <Link to="/categories" className="sidebar-link">Categories</Link>
        </li>
        {token?.role === 'admin' && <li className="sidebar-item"><Link to="/users" className="sidebar-link">Users</Link></li>}
      </ul>
    </aside>
  );
};

export default Sidebar;
