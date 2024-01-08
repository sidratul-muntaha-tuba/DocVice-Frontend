import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss'; // Make sure to create a corresponding SCSS file
import { useAuth } from '../../contexts/AuthContext';


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the token, redirect, etc.
        localStorage.setItem('token', data.token);
        login(data.token, data.user);
        navigate('/'); // Redirect to dashboard after login
      } else {
        // Handle errors, show messages, etc.
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      // Handle network errors, show messages, etc.
      setError('There was a problem with the login request');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={credentials.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
