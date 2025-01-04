import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const OTPprotect = ({ children }) => {
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('expiryTime');
  const isVerified = user?.isEmailVerified;

  if (new Date().getTime() > expiry) {
    localStorage.removeItem('expiryTime');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser('');
  }

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (!isVerified) {
      navigate('/verifymail');
    }
  }, [token, navigate, isVerified]); // Dependencies ensure navigation happens when `token` changes.

  return token && isVerified ? <>{children}</> : null; // Render children only if token exists.
};

export default OTPprotect;
