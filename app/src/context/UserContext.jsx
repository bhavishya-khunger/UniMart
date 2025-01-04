import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error("Error saving user to localStorage:", error);
        }
    }, [user]);

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;