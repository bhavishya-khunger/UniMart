import Shop from "../models/shop.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

export const verifyShop = async (req, res) => {
    try {
        const { shopId } = req.body;
        if (!shopId) return res.status(400).json({
            message: "No ShopID Found.",
        })
        
        const shop = await Shop.findByIdAndUpdate(shopId, { verified: true });
        const user = await User.findByIdAndUpdate(shop?.owner, { isShopVerified: true });  

        return res.status(200).json({
            message: "Shop verified!",
            shop, user
        })
    } catch (error) {
        console.log(error);
    }
}

export const transferCoins = async (req, res) => {
    try {
        const {userSID, adminId, amount, title, password} = req.body;

        if (!userSID || !adminId || !amount || !title || !password) return res.status(400).json({
            message: "Missing required fields."
        });

        const user = await User.findOne({sid: userSID});
        const admin = await User.findById(adminId);

        const validPassword = await admin.comparePassword(password);

        if (!validPassword) return res.status(400).json({
            message: "Invalid password."
        });

        if (!user || !admin) return res.status(404).json({
            message: "User not found."
        });

        if (admin.role !== "Admin") return res.status(400).json({
            message: "Unauthorized."
        });

        if (admin.coins < amount) return res.status(400).json({
            message: "Insufficient coins."
        });

        user.coins = (user.coins || 0) + Number(amount);
        await user.save();

        admin.coins = (admin.coins || 0) - Number(amount);
        await admin.save();

        const userTransaction = new Transaction({
            userId: user?._id,
            coinsEarned: amount,
            coinsSpent: 0,
            title: title,
        });

        const adminTransaction = new Transaction({
            userId: admin._id,
            coinsEarned: 0,
            coinsSpent: amount,
            title: `${title} : Transfer to ${user?.name}`,
        });

        await userTransaction.save();
        await adminTransaction.save();

        user.transactionHistory.push(userTransaction._id);
        await user.save();

        admin.transactionHistory.push(adminTransaction._id);
        await admin.save();

        return res.status(200).json({
            message: "Coins transferred successfully.",
            user
        });
    } catch (error) {
        console.log(error);
    }
}