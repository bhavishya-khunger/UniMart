import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProtectRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('expiryTime');
  // const isVerified = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).verified : '';

  if (new Date().getTime() > expiry) {
    localStorage.removeItem('expiryTime');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]); // Dependencies ensure navigation happens when `token` changes.

  return token ? <>{children}</> : null; // Render children only if token exists.
};

export default UserProtectRoute;
