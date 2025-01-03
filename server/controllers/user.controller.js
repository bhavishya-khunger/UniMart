import User from '../models/user.model.js';
import Shop from '../models/shop.model.js';
import Order from '../models/order.model.js';
import bcrypt from 'bcrypt';
import Transaction from '../models/transaction.model.js';
import { sendMessageToSocketId } from '../src/socket.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, sid, role, referalCode } = req.body;

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
        }).populate("friendList.id");

        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ message: 'Email or SID already in use.' });
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);

        // Referral
        console.log(referalCode);
        if (referalCode.length > 0) {
            const referredByUsers = await User.find({ referalCode: referalCode });

            if (referredByUsers.length === 0) return res.status(400).json({ message: "Invalid Referral Code" });

            const referredBy = referredByUsers[0];

            const referal = new Transaction({
                userId: referredBy._id,
                coinsEarned: 30,
                coinsSpent: 0,
                title: "Referal Bonus"
            });

            referredBy.coins += 30;
            referredBy.transactionHistory.push(referal);

            await referal.save();
            await referredBy.save();
        }

        // Create a new user
        const user = new User({
            name,
            sid,
            referredBy: referalCode ? referalCode : "",
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
            user = await User.findOne({ email: credential }).populate("friendList.id");
        } else {
            user = await User.findOne({ sid: credential }).populate("friendList.id");
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

export const getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({ message: "User Not Found" });

        const transactions = await User.findById(userId).select('-password').populate('transactionHistory');

        if (!transactions) return res.status(400).json({ message: "No Transactions Yet" });

        return res.status(200).json({
            transactions: transactions?.transactionHistory
        })
    } catch (error) {
        console.log(error);
    }
}

export const getOrdersForShop = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID not provided." });
        }

        const shop = await Shop.findOne({ owner: userId });

        if (!shop) {
            return res.status(400).json({ message: "Shop not registered." });
        }

        let allOrders = await Order.find({
            orderStatus: { $in: ['Completed', 'Accepted'] }
        })
            .populate("productDetails.item")
            .populate("deliveryPersonId");

        if (shop.shopType === "print") {
            allOrders = await Order.find({
                orderStatus: { $in: ['Completed', 'Pending'] }
            })
                .populate("productDetails.item")
                .populate("deliveryPersonId");
        }

        const shopOrders = allOrders.filter(order => 
            shop.shopType === "food" 
            ? order.productDetails.item.shopId.toString() === shop._id.toString() 
            : order.shopId.toString() === shop._id.toString()
        );

        return res.status(200).json({
            orders: shopOrders,
        });
    } catch (error) {
        console.error("Error in getOrdersForShop:", error.message, error.stack);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const startAcceptingOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        user.agreesToDeliver = !user.agreesToDeliver;
        await user.save();
        return res.status(200).json({
            message: "User Updated.",
            user: await User.findById(userId).select('-password')
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const editProfile = async (req, res) => {
    try {
        const { userId, address, phone } = req.body;

        if (!userId) return res.status(400).json({
            message: "User ID is required.",
        });

        console.log(phone);
        if (phone && phone <= 999999999 && phone >= 10000000000) {
            return res.status(400).json("Phone Number Invalid");
        }

        const user = await User.findByIdAndUpdate(userId, { address: address, phone: phone });

        await user.save();

        return res.status(200).json({
            message: "User saved!",
            user: await User.findById(userId).select('-password'),
        })
    } catch (error) {
        console.log(error);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const shopkeepers = users.filter(user => user.role === 'Shopkeeper');
        const students = users.filter(user => user.role === 'Student');
        return res.status(200).json({
            totalUsers: users,
            shopkeepers: shopkeepers,
            students: students
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Friends

export const addFriend = async (req, res) => {
    try {
        const { userId, friendSID } = req.body;

        if (!userId || !friendSID) {
            return res.status(400).json({ message: "User ID and Friend SID are required." });
        }

        const user = await User.findById(userId);
        const friend = await User.findOne({ sid: friendSID });

        if (!user || !friend) {
            return res.status(404).json({ message: "User or Friend not found." });
        }

        const existingFriend = user.friendList.find(f => f.id.toString() === friend._id.toString());
        if (existingFriend) {
            if (existingFriend.status === "Approved") {
                return res.status(400).json({ message: "Friend already added." });
            } else if (existingFriend.status === "Received") {
                existingFriend.status = "Approved";
                await user.save();
                const friendIndex = friend?.friendList?.findIndex(f => f.id.toString() === userId);
                if (friendIndex !== -1 && friend?.friendList[friendIndex].status === "Sent") {
                    friend.friendList[friendIndex].status = "Approved";
                    await friend.save();
                }
                sendMessageToSocketId(friend.socketId, {
                    event: "friendRequestApproved",
                    data: await User.findOne({ socketId: friend?.socketId }).populate('friendList.id'),
                });
                return res.status(200).json({
                    message: "Friend request approved.",
                    user: await User.findById(userId).populate('friendList.id', '-password').select('-password')
                });
            }
        }

        return res.status(200).json({
            message: "Friend added successfully.",
            user: await User.findById(userId).populate('friendList.id', '-password').select('-password')
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const sendFriendRequest = async (req, res) => {
    try {
        const { userId, friendSID } = req.body;

        if (!userId || !friendSID) {
            return res.status(400).json({ message: "User ID and Friend SID are required." });
        }

        const user = await User.findById(userId);
        const receiver = await User.findOne({ sid: friendSID });

        if (!user || !receiver) {
            return res.status(404).json({ message: "User or Friend not found." });
        }

        const existingRequest = user?.friendList?.find(friend => friend.id.toString() === receiver._id.toString());
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent or user already in friend list." });
        }

        user.friendList.push({ id: receiver._id, status: "Sent" });
        receiver.friendList.push({ id: userId, status: "Received" });

        await user.save();
        await receiver.save();

        sendMessageToSocketId(receiver.socketId, {
            event: "friendRequestReceived",
            data: await User.findOne({ socketId: receiver?.socketId }).populate('friendList.id'),
        });

        return res.status(200).json({
            message: "Friend request sent successfully.",
            user: await User.findById(userId).populate('friendList.id', '-password').select('-password')
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteFriend = async (req, res) => {
    try {
        const { userId, friendSID } = req.body;

        if (!userId || !friendSID) {
            return res.status(400).json({ message: "User ID and Friend SID are required." });
        }

        const user = await User.findById(userId);
        const friend = await User.findOne({ sid: friendSID });

        if (!user || !friend) {
            return res.status(404).json({ message: "User or Friend not found." });
        }

        user.friendList = user.friendList.filter(f => f.id.toString() !== friend._id.toString());
        friend.friendList = friend.friendList.filter(f => f.id.toString() !== userId);

        await user.save();
        await friend.save();

        sendMessageToSocketId(friend.socketId, {
            event: "friendDeleted",
            data: await User.findOne({ socketId: friend?.socketId }).populate('friendList.id'),
        });

        return res.status(200).json({
            message: "Friend deleted successfully.",
            user: await User.findById(userId).populate('friendList.id', '-password').select('-password')
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};