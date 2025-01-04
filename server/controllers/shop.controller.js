import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

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
        // console.error("Error creating shop:", error.message);
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

// PRINTS

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

export const getPrintOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({
            message: "No UserID Found."
        });

        const user = await User.findById(userId);

        const shopId = user.shopId;

        const orders = await Order.find({ shopId }).populate("userId");

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        };

        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching print orders:", error.message);
        return res.status(500).json({ error: error.message });
    }
}

export const markPrintForPickup = async (req, res) => {
    try {
        const { orderId, shopkeeperId } = req.body;

        if (!orderId) return res.status(400).json({ message: "Order ID is required." });
        if (!shopkeeperId) return res.status(400).json({ message: "Shopkeeper ID is required." });

        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: "Order not found." });

        const isAuthorized = order?.shopId?.owner?.toString() === shopkeeperId;

        if (order.orderStatus === "Completed") return res.status(400).json({ message: "Order already marked as Completed!" });

        order.orderStatus = "Completed";
        await order.save();

        const shopKeeper = await User.findById(shopkeeperId).select('-password');
        shopKeeper?.orderHistory?.push(orderId);

        res.status(200).json({ message: "Order marked as prepared for pickup.", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const markPrintAsPickedUp = async (req, res) => {
    try {
        const { orderId, userId } = req.body;

        if (!orderId) return res.status(400).json({ message: "Order ID is required." });
        if (!userId) return res.status(400).json({ message: "User ID is required." });

        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: "Order not found." });

        const isAuthorized = order?.userId?.toString() === userId;

        if (!isAuthorized) return res.status(403).json({ message: "You are not authorized to mark this order as picked up." });

        if (order.orderStatus === "Delivered") return res.status(400).json({ message: "Order already marked as Picked Up!" });

        order.orderStatus = "Delivered";

        await order.save();

        res.status(200).json({ message: "Order marked as picked up.", order });
    } catch (error) {
        console.log(error);
    }
}

export const cancelPrintOrder = async (req, res) => {
    try {
        const { orderId, shopkeeperId } = req.body;

        if (!orderId) return res.status(400).json({ message: "Order ID is required." });
        if (!shopkeeperId) return res.status(400).json({ message: "Shopkeeper ID is required." });

        const order = await Order.findById(orderId).populate("shopId");

        if (!order) return res.status(404).json({ message: "Order not found." });

        const isAuthorized = order?.shopId?.owner?.toString() === shopkeeperId;

        if (!isAuthorized) return res.status(403).json({ message: "You are not authorized to cancel this order." });

        if (order?.orderStatus === "Cancelled") return res.status(400).json({ message: "Order already cancelled!" });

        order.orderStatus = "Cancelled";
        await order.save();

        res.status(200).json({ message: "Order cancelled.", order });
    } catch (error) {
        console.log(error);
    }
}