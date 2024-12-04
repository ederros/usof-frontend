import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as auth } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const authStatus = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user == null) return;
    const decodedToken = jwtDecode(user.jwt);
    const currentTime = Date.now() / 1000;
    if (authStatus === 'succeeded' && decodedToken.exp > currentTime) {
      navigate('/profile');
    }
  }, [authStatus, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(auth({ login, password }));
  };

  const handleRecoveryRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/password-reset', { email: recoveryEmail });
      setRecoveryMessage(response.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setRecoveryMessage(err.response?.data?.message || 'Error sending password reset link.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/auth/password-reset/${resetToken}`, { newPassword });
      setRecoveryMessage(response.data.message || 'Password reset successful. You can now log in.');
      setShowRecoveryForm(false);
    } catch (err) {
      setRecoveryMessage(err.response?.data?.message || 'Error resetting password.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {authStatus === 'loading' && <p>Loading...</p>}
      {authStatus === 'succeeded' && <p>Success</p>}
      {authStatus === 'failed' && <p>Login failed</p>}

      <button
        className="recovery-toggle-btn"
        onClick={() => setShowRecoveryForm(!showRecoveryForm)}
      >
        {showRecoveryForm ? 'Back to Login' : 'Forgot Password?'}
      </button>

      {showRecoveryForm && (
        <div className="password-recovery">
          <h3>Password Recovery</h3>
          {!resetToken ? (
            <form onSubmit={handleRecoveryRequest}>
              <input
                type="email"
                placeholder="Enter your email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
              />
              <button type="submit">Send Reset Link</button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset}>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="submit">Reset Password</button>
            </form>
          )}
          {recoveryMessage && <p>{recoveryMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
