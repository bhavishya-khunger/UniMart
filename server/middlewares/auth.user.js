import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        // console.log(token);
        if (!token) {
            return res.status(400).json({ message: "Access Denied - UNAUTHORIZED" });
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded:", decoded);
        if (!decoded) {
            return res.status(400).json({ message: "Access Denied - UNAUTHORIZED" });
        }

        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        req.user = user;
        return next();
    } catch (error) {
        console.log(error);
    }
}