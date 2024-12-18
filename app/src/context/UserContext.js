import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const endpoint = `${import.meta.env.VITE_USER_BASE_URL}/register`;
      const res = await axios.post(endpoint, userData);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, setUser, registerUser }}>
      {children}
    </UserContext.Provider>
  );
};
