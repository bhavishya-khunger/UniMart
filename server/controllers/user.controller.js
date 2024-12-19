import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, sid, role } = req.body;

        // console.log(req.body);
        console.log(req.body);

        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        if (sid) {
            if (!/^\d{8}$/.test(sid)) {
                return res.status(400).json({ message: 'SID must be an 8-digit number.' });
            }
        }

        // Check if email or SID already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { sid: sid || '99999999' }]
        });

        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ message: 'Email or SID already in use.' });
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            sid,
            password: hashedPass,
            email,
            role
        });

        // Save the user to the database
        await user.save();

        // Generate auth token
        const token = user.generateToken();

        // Respond with success
        res.status(201).json({
            message: "User registered successfully.",
            token,
            user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { credential, password } = req.body;

        console.log(req.body);

        if (!credential || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Determine if the credential is an email or sid
        let user;
        if (credential.includes("@")) {
            user = await User.findOne({ email: credential });
        } else {
            user = await User.findOne({ sid: credential });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials." });
        }

        const auth = await user.comparePassword(password);

        if (!auth) {
            return res.status(400).json({ message: "Invalid Credentials." });
        }

        const isActive = user?.account;

        console.log(isActive);

        if (isActive === 'Suspended') {
            return res.status(400).json({ message: "User's Account is Suspended." });
        }
        if (isActive === 'Deactivated') {
            return res.status(400).json({
                message: "User's Account is Deactivated Temporarily. Kindly contact Admin to activate your account."
            });
        }

        const token = await user.generateToken();

        // Respond with success
        res.status(200).cookie("token", token).json({
            message: "User Logged In.",
            token,
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "User logged out." })
    } catch (err) {
        console.log(err);
    }
}

export const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) return res.status(400).json({ message: "User Not Found" });

        const user = await User.findById(userId).select('-password');

        if (!user) return res.status(400).json({ message: "User Not Found" });

        return res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error);
    }
}

// TO BE UPDATED
export const getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) return res.status(400).json({ message: "User Not Found" });

        const user = await User.findById(userId).select('-password');

        if (!user) return res.status(400).json({ message: "User Not Found" });

        return res.status(200).json({
            transactions: user?.transactionHistory
        })
    } catch (error) {
        console.log(error);
    }
}

// To be UPDATED
export const getOrderHistory = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) return res.status(400).json({ message: "User Not Found" });

        const user = await User.findById(userId).select('-password');

        if (!user) return res.status(400).json({ message: "User Not Found" });

        return res.status(200).json({
            orders: user?.orderHistory
        })
    } catch (error) {
        console.log(error);
    }
}