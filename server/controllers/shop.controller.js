import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find({});

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
        const { shopName, shopImage, owner } = req.body;

        // Validate input
        if (!shopName || !shopImage || !owner) {
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
        const newShop = new Shop({ shopImage, shopName, owner });
        await newShop.save();

        // Update user
        const user = await User.findByIdAndUpdate(
            owner,
            { isShopVerified: true },
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
