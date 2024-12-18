import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProtectRoute = ({ children }) => {
  const navigate = useNavigate();
  const isShopKeeper = JSON.parse(localStorage.getItem('user')).role === "Shopkeeper" ? true : false;
  // work on this -> add a isShopSetup in user for shopkeepers, keep it false, once user sets up shop name and image, set it true and show his shop

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
