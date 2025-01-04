import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied - UNAUTHORIZED" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Access Denied - UNAUTHORIZED" });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
