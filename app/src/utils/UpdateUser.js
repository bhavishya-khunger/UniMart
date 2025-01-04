import axios from 'axios';

export const loadUserFromServer = async (userId, setUser) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${import.meta.env.VITE_USER_BASE_URL}/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        console.log("User data fetched successfully:", response.data.user);
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
};