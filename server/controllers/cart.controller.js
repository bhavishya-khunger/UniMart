import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import Shop from '../models/shop.model.js';
import Coupon from '../models/coupon.model.js';
import Product from '../models/product.model.js';
import bcrypt from 'bcrypt';
import { log } from 'console';
import Order from '../models/order.model.js';
import Transaction from '../models/transaction.model.js';
import { sendMessageToSocketId } from '../src/socket.js';


export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.total += product.price;
            cart.totalPrice += product.price;
        } else {
            cart.items.push({
                productId,
                quantity,
                name: product.productName,
                price: product.price,
            });
            cart.totalPrice += product.price;
        }

        await cart.save();

        res.status(200).json({
            message: "Product added to cart successfully.",
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const removeItemFromCart = async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;

        // Validate input
        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required." });
        }

        // Fetch cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart." });
        }

        // Reduce quantity or remove item
        const item = cart.items[itemIndex];
        if (item.quantity > quantity) {
            // Reduce quantity
            item.quantity -= quantity;
            cart.totalPrice -= item.price;
            item.total -= item.price;
        } else {
            // Remove item from cart
            cart.items.splice(itemIndex, 1);
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully.",
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const cart = await Cart.findOne({ userId }).populate({ path: 'items.productId', model: 'Product' });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

// In progress - to be completed soon
export const applyCoupon = async (req, res) => {
    try {
        const { code, cartId } = req.body;

        if (!cartId) {
            return res.status(400).json({ message: "Cart NOT found." });
        }

        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            return res.status(400).json({ message: "Invalid Coupon code" });
        }

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(400).json({ message: "Cart NOT found." });
        }


    } catch (error) {
        log(error);
    }
};

export const orderCart = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found." });

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        const cartItems = cart.items.map(item => {
            return {
                item: item.productId,
                totalPrice: item.total,
            }
        });

        console.log("cartItems", cart);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        if (user?.coins < 1.13*(cart?.totalPrice)) return res.status(400).json({
            message: "Current Balance: " + user?.coins + "pts"
        });

        if (cart.items.length === 0) return res.status(400).json({ message: "Cart is empty." });

        // Create order from cart
        const order = new Order({
            userId,
            productDetails: cartItems,
        });

        await order.save();

        // Clear cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({
            message: "Order placed successfully. Waiting for the acceptance!",
            order: order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const findAOrder = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const order = await Order.find({ userId })
            .populate('userId', '-password')
            .populate('productDetails.item')
            .populate('deliveryPersonId')
            .populate({
                path: 'productDetails.item', // Populate the `item` field in `productDetails`
                populate: {
                    path: 'shopkeeperId', // Populate the `shopkeeperId` field within `Product`
                    model: 'User', // Reference the Shopkeeper model
                },
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json({
            message: "Order found successfully.",
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const processOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required." });
        }

        const order = await Order.findById(orderId)
            .populate('userId', '-password -address')
            .populate('productDetails.item')
            .populate('deliveryPersonId', '-password');

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        let totalOrderValue = 0;
        let totalDeliveryPersonEarnings = 0;
        let totalShopKeeperEarnings = 0;
        let totalAdminEarnings = 0;

        for (let i = 0; i < order.productDetails.length; i++) {
            const orderValue = order.productDetails[i].totalPrice;
            totalOrderValue += orderValue;
            totalDeliveryPersonEarnings += Math.ceil(orderValue * 0.08);
            totalShopKeeperEarnings += Math.ceil(orderValue * 0.87);
        }

        totalAdminEarnings = totalOrderValue - totalDeliveryPersonEarnings - totalShopKeeperEarnings;
        console.log("ADMIN EARNINGS ARE ", totalAdminEarnings);
        const user = await User.findById(order.userId._id);
        const deliveryPerson = await User.findById(order.deliveryPersonId._id);
        const admin = await User.findOne({ role: 'Admin' });

        user.coins -= totalOrderValue;
        deliveryPerson.coins += totalDeliveryPersonEarnings;
        admin.coins += totalAdminEarnings;

        const userTransaction = await new Transaction({
            userId: user._id,
            coinsEarned: 0,
            coinsSpent: totalOrderValue,
            orderId: order._id,
            title: "Order Debit"
        }).save();

        const deliveryPersonTransaction = await new Transaction({
            userId: deliveryPerson._id,
            coinsEarned: totalDeliveryPersonEarnings,
            coinsSpent: 0,
            orderId: order._id,
            title: "Delivery Credit"
        }).save();

        for (let i = 0; i < order.productDetails.length; i++) {
            const shopKeeper = await User.findById(order.productDetails[i].item.shopkeeperId);
            const shopKeeperEarnings = Math.ceil(order.productDetails[i].totalPrice * 0.87);
            shopKeeper.coins += shopKeeperEarnings;

            const shopKeeperTransaction = await new Transaction({
                userId: shopKeeper._id,
                coinsEarned: shopKeeperEarnings,
                coinsSpent: 0,
                orderId: order._id,
                title: "Order Credit"
            }).save();

            shopKeeper.transactionHistory.push(shopKeeperTransaction);
            await shopKeeper.save();
        }

        const adminTransaction = await new Transaction({
            userId: admin._id,
            coinsEarned: totalAdminEarnings,
            coinsSpent: 0,
            orderId: order._id,
            title: "Order Commission"
        }).save();

        user.transactionHistory.push(userTransaction);
        deliveryPerson.transactionHistory.push(deliveryPersonTransaction);
        admin.transactionHistory.push(adminTransaction);

        await user.save();
        await deliveryPerson.save();
        await admin.save();

        return res.status(200).json({
            message: "Order processed successfully.",
            order: await Order.findById(orderId)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const sendRequest = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "No order ID provided." });
        }

        const order = await Order.findById(orderId)
            .populate('userId', '-password')
            .populate('productDetails.item')
            .populate({
                path: 'productDetails.item', // Populate the `item` field in `productDetails`
                populate: {
                    path: 'shopkeeperId', // Populate the `shopkeeperId` field within `Product`
                    model: 'User', // Reference the Shopkeeper model
                },
            });

        if (!order) {
            return res.status(400).json({ message: "No order exists with this ID." });
        }

        if (order?.orderStatus !== "Pending") return res.status(400).json({ message: "Delivery Partner already assigned." });

        // Use Promise.all to fetch all shops concurrently
        const shops = await Promise.all(
            order.productDetails.map(async (product) => {
                if (product.item.shopkeeperId) {
                    return await Shop.findOne({ owner: product.item.shopkeeperId }).select('shopName');
                }
                return null; // Handle cases where `shopkeeperId` is missing
            })
        );

        let totalFee = 0;
        order.productDetails.map((product) => {
            totalFee += product?.totalPrice;
        });

        const deliveryFee = Math.ceil(0.08 * totalFee);

        const users = await User.find({ agreesToDeliver: true }).select('-password');

        const filteredUsers = users.filter(
            (user) => user._id.toString() !== order.userId._id.toString()
        );

        // Send order and shops to the users via socket
        filteredUsers.map((user) => {
            sendMessageToSocketId(user.socketId, {
                event: "order-request",
                data: { order, shops, deliveryFee },
            });
        });

        return res.status(200).json({
            message: "Requests Sent to the users.",
            filteredUsers,
            order,
            shops,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const confirmOrder = async (req, res) => {
    try {
        const { orderId, userId } = req.body;

        if (!orderId) return res.status(400).json({ message: "No order ID found." });

        if (!userId) return res.status(400).json({ message: "No user ID found." });

        const order = await Order.findById(orderId);

        if (order.deliveryPersonId) {
            return res.status(400).json({ message: "Delivery person already assigned." });
        }

        // Fetch the order details and update it
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { deliveryPersonId: userId, orderStatus: "Accepted" },
            { new: true }
        )
            .populate('userId', '-password')
            .populate('productDetails.item')
            .populate({
                path: 'productDetails.item', // Populate the `item` field in `productDetails`
                populate: {
                    path: 'shopkeeperId', // Populate the `shopkeeperId` field within `Product`
                    model: 'User', // Reference the Shopkeeper model
                },
            });

        if (!updatedOrder) return res.status(404).json({ message: "Order not found." });

       

        const deliveryPerson = await User.findById(userId).select('-password');

        if (!deliveryPerson) {
            return res.status(404).json({ message: "Delivery person not found." });
        }

        // Send message to the user who placed the order
        sendMessageToSocketId(updatedOrder?.userId?.socketId, {
            event: 'order-accepted',
            data: { updatedOrder, deliveryPerson },
        });

        // Send message to all shopkeepers associated with the order
        const shopkeeperIds = updatedOrder.productDetails.map(detail => detail.item.shopkeeperId);
        for (const shopkeeper of shopkeeperIds) {
            if (shopkeeper?.socketId) {
                sendMessageToSocketId(shopkeeper.socketId, {
                    event: 'order-accepted',
                    data: { updatedOrder, deliveryPerson },
                });
            }
        }

        return res.status(200).json({ message: "Order confirmed and notifications sent.", updatedOrder });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};
