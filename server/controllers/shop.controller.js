import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find({ verified: true });
        console.log(shops);
        if (!shops) return res.status(400).json({
            message: "No Shops Found Near You."
        });

        return res.status(200).json({ shops });
    } catch (error) {
        console.log(error);
    }
}

export const createShop = async (req, res) => {
    try {
        const { shopName, shopType, shopImage, owner } = req.body;

        console.log("SHOP: ", shopType);

        // Validate input
        if (!shopName || !shopImage || !owner || !shopType) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check for duplicate shop
        const prevShop = await Shop.findOne({ $or: [{ shopName }, { owner }] });
        if (prevShop) {
            return res.status(400).json({
                message: "A shop with the same name or the logged account already exists."
            });
        }

        // Create shop
        const newShop = new Shop({ shopImage, shopName, owner, shopType });
        await newShop.save();

        // Update user
        const user = await User.findByIdAndUpdate(
            owner,
            { shopId: newShop?._id, shopType: shopType, isShopVerified: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "Owner not found." });
        }

        // Return success response
        return res.status(201).json({
            message: "Restaurant Listed.",
            shop: newShop,
            user
        });
    } catch (error) {
        console.error("Error creating shop:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const getUnverifiedShops = async (req, res) => {
    try {
        const shops = await Shop.find({ verified: false }).populate("owner");

        if (!shops) return res.status(400).json({
            message: "Can't find any recent shop registrations."
        })
        return res.status(200).json({
            shops
        })
    } catch (error) {
        console.log(error);
    }
}

export const getPrinters = async (req, res) => {
    try {
        const printers = await Shop.find({ shopType: "print", verified: true }).populate("owner");

        if (!printers || printers.length === 0) {
            return res.status(404).json({ message: "No printers found." });
        }

        return res.status(200).json({ printers });
    } catch (error) {
        console.error("Error fetching printers:", error.message);
        return res.status(500).json({ error: error.message });
    }
}