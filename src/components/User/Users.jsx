import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/Users.css'; // Assuming you have a CSS file for this component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/api/users', { withCredentials: true })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="users-container">
      <h2 className="users-title">Users</h2>
      {error ? (
        <div className="users-error">Error: {error}</div>
      ) : (
        <ul className="users-list">
          {users.map((user) => (
            <li key={user.id} className="users-item">
              <Link to={`/users/${user.id}`} className="users-link">
                {user.full_name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Users;
