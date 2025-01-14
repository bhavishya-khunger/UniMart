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

        const product = await Product.findById(productId).populate('shopkeeperId');
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        } else {
            // Check if the cart already contains items from a different shop
            const existingShopId = cart.items.length > 0 ? cart.items[0].productId.shopkeeperId : null;
            if (existingShopId && existingShopId.toString() !== product.shopkeeperId._id.toString()) {
                return res.status(400).json({ message: "You can only add items from the same shop." });
            }
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
        // console.error(error);


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
        // console.error(error);


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
        // console.error(error);


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
        // log(error);


    }
};

export const orderCart = async (req, res) => {
    try {
        const { userId, comments } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found." });

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            populate: {
                path: 'shopkeeperId',
                model: 'User'
            }
        });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // Ensure all items in the cart belong to the same shop
        const shopIds = cart.items.map(item => item.productId.shopkeeperId.toString());
        const uniqueShopIds = [...new Set(shopIds)];
        if (uniqueShopIds.length > 1) {
            return res.status(400).json({ message: "All items in the cart must belong to the same shop." });
        }

        const cartItems = cart.items.map(item => {
            return {
                item: item.productId,
                totalPrice: item.total,
            }
        });

        if (user?.coins < 1.13 * (cart?.totalPrice)) return res.status(400).json({
            message: "Current Balance: " + user?.coins + "pts"
        });

        if (cart.items.length === 0) return res.status(400).json({ message: "Cart is empty." });
        const shopId = cart.items[0].productId.shopkeeperId.shopId;
        // Create order from cart
        const order = new Order({
            comments: comments,
            userId,
            productDetails: cartItems,
            shopId,
        });

        // console.log("ORDER IS ", order);

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
        // console.error(error);


        res.status(500).json({ message: "Internal server error." });
    }
};

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
            .populate('shopId')
            .populate({
                path: 'shopId',
                populate: {
                    path: 'owner',
                    model: 'User',
                },
            })
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
        // console.error(error);


        res.status(500).json({ message: "Internal server error." });
    }
}

export const sendRequest = async (req, res) => {
    try {
        const { orderId, sendToFriends } = req.body;

        // Validate orderId
        if (!orderId) {
            return res.status(400).json({ message: "No order ID provided." });
        }

        // Fetch the order details and populate related fields
        const order = await Order.findById(orderId)
            .populate('userId', '-password')
            .populate('userId.friendList')
            .populate('productDetails.item')
            .populate({
                path: 'productDetails.item',
                populate: {
                    path: 'shopkeeperId',
                    model: 'User',
                },
            });

        // Validate the existence of the order
        if (!order) {
            return res.status(400).json({ message: "No order exists with this ID." });
        }

        // Ensure the order status is "Pending"
        if (order?.orderStatus !== "Pending") {
            return res.status(400).json({ message: "Delivery Partner already assigned." });
        }

        // Filter approved friends
        const placedByFriends = order.userId.friendList.filter(
            (friend) => friend.status === 'Approved' && friend.id.toString() !== order.userId._id.toString()
        );

        const populatedFriends = await Promise.all(
            placedByFriends.map(async (friend) => {
                const populatedFriend = await User.findById(friend.id).select('-password');
                return {
                    populatedFriend,
                };
            })
        );

        // Log debugging information
        // console.log("sendToFriends:", sendToFriends);
        // console.log("Friend List:", order.userId.friendList);
        console.log("Placed By Friends:", populatedFriends);

        // Fetch shop details concurrently
        const shops = await Promise.all(
            order.productDetails.map(async (product) => {
                if (product.item.shopkeeperId) {
                    return await Shop.findOne({ owner: product.item.shopkeeperId }).select('shopName');
                }
                return null;
            })
        );

        // Calculate delivery fee
        let totalFee = 0;
        order.productDetails.forEach((product) => {
            totalFee += product?.totalPrice || 0;
        });
        const deliveryFee = Math.ceil(0.08 * totalFee);

        // Find all users who agree to deliver and exclude the order's owner
        const users = await User.find({ agreesToDeliver: true, role: 'Student' }).select('-password');
        const filteredUsers = users.filter(
            (user) => user._id.toString() !== order.userId._id.toString()
        );

        // Send order requests
        if (!sendToFriends) {
            filteredUsers.forEach((user) => {
                sendMessageToSocketId(user.socketId, {
                    event: "order-request",
                    data: { order, shops, deliveryFee },
                });
            });
        } else {
            populatedFriends.forEach((friend) => {
                sendMessageToSocketId(friend.populatedFriend.socketId, {
                    event: "order-request",
                    data: { order, shops, deliveryFee },
                });
            });
        }

        // Respond with success
        return res.status(200).json({
            message: "Requests sent to the users.",
            allUsers: sendToFriends ? placedByFriends : filteredUsers,
            order,
            shops,
        });
    } catch (error) {
        // Log and respond with error
        console.error("Error in sendRequest:", error);
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
        // console.log(err);


        return res.status(500).json({ message: err.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId, shopkeeperId } = req.body;

        if (!orderId) return res.status(400).json({ message: "Order ID not found." });
        if (!shopkeeperId) return res.status(400).json({ message: "Shopkeeper ID not found." });

        const order = await Order.findById(orderId).populate('productDetails.item');

        if (!order) return res.status(400).json({ message: "Order not found." });

        // Verify that the request is being sent by the shopkeeper from whose shop the order is placed
        const isAuthorized = order.productDetails.some(detail => detail.item.shopkeeperId.toString() === shopkeeperId);
        if (!isAuthorized) return res.status(403).json({ message: "You are not authorized to cancel this order." });

        // Notify the user who placed the order
        sendMessageToSocketId(order.userId.socketId, {
            event: 'order-cancelled',
            data: { order },
        });

        // Notify the delivery person if assigned
        if (order.deliveryPersonId && order.deliveryPersonId.socketId) {
            sendMessageToSocketId(order.deliveryPersonId.socketId, {
                event: 'order-cancelled',
                data: { order },
            });
        }

        order.orderStatus = "Cancelled";
        await order.save();

        res.status(200).json({ message: "Order cancelled successfully.", order });
    } catch (error) {
        // console.log(error);


        res.status(500).json({ message: "Internal server error." });
    }
}

export const markOrderForPickup = async (req, res) => {
    try {
        const { orderId, shopkeeperId } = req.body;

        if (!orderId) return res.status(400).json({ message: "Order ID is required." });
        if (!shopkeeperId) return res.status(400).json({ message: "Shopkeeper ID is required." });

        const order = await Order.findById(orderId).populate('productDetails.item');

        if (!order) return res.status(404).json({ message: "Order not found." });

        const isAuthorized = order.productDetails.some(detail => detail.item.shopkeeperId.toString() === shopkeeperId);
        if (!isAuthorized) return res.status(403).json({ message: "You are not authorized to mark this order for pickup." });

        if (order.orderStatus === "Completed") return res.status(400).json({ message: "Order already marked as Completed!" });

        order.orderStatus = "Completed";
        await order.save();

        const shopKeeper = await User.findById(shopkeeperId).select('-password');
        shopKeeper?.orderHistory?.push(order);

        const shop = await Shop.findOne({ owner: shopkeeperId }).select('shopName');
        const shopName = shop ? shop.shopName : 'Unknown Shop';

        if (order.deliveryPersonId && order.deliveryPersonId.socketId) {
            sendMessageToSocketId(order.deliveryPersonId.socketId, {
                event: 'order-ready-for-pickup',
                data: { order, shopName },
            });
        }

        shopKeeper?.orderHistory?.push(order);
        await shopKeeper.save();

        res.status(200).json({ message: "Order marked as prepared for pickup.", order });
    } catch (error) {
        // console.log(error);


        res.status(500).json({ message: "Internal server error." });
    }
}

export const getActiveOrdersByDeliveryPerson = async (req, res) => {
    try {
        const { deliveryPersonId } = req.params;

        if (!deliveryPersonId) {
            return res.status(400).json({ message: "Delivery Person ID is required." });
        }

        const orders = await Order.find({
            deliveryPersonId,
            orderStatus: { $in: ["Accepted", "Out for Delivery", "Completed"] }
        })
            .populate('userId', '-password')
            .populate('productDetails.item')
            .populate('shopId')
            .populate({
                path: 'productDetails.item',
                populate: {
                    path: 'shopkeeperId',
                    model: 'User',
                },
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No active orders found for this delivery person." });
        }

        const sentOrders = orders.filter(order => order?.pdfLink ? null : order);

        res.status(200).json({
            message: "Active orders found successfully.",
            orders: sentOrders,
        });
    } catch (error) {
        // console.error(error);


        res.status(500).json({ message: "Internal server error." });
    }
};

export const markOrderOutForDelivery = async (req, res) => {
    try {
        const { orderId, deliveryPersonId } = req.body;

        if (!orderId) return res.status(400).json({ message: "Order ID is required." });
        if (!deliveryPersonId) return res.status(400).json({ message: "Delivery Person ID is required." });

        const order = await Order.findById(orderId).populate('productDetails.item');

        if (!order) return res.status(404).json({ message: "Order not found." });

        if (order.deliveryPersonId.toString() !== deliveryPersonId) {
            return res.status(403).json({ message: "You are not authorized to update this order." });
        }

        if (order.orderStatus !== "Completed") {
            return res.status(400).json({ message: "Order is not in a state that can be marked as out for delivery." });
        }

        order.orderStatus = "Out for Delivery";

        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        order.otp = otp;

        await order.save();

        // Notify the user who placed the order
        sendMessageToSocketId(order.userId.socketId, {
            event: 'order-out-for-delivery',
            data: { order },
        });

        res.status(200).json({ message: "Order status updated to Out for Delivery.", order });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

export const processOrderDelivery = async (req, res) => {
    try {
        const { orderId, deliveryPersonId, otp } = req.body;

        if (!orderId) return res.status(400).json({ message: "Order ID is required." });
        if (!deliveryPersonId) return res.status(400).json({ message: "Delivery Person ID is required." });
        if (!otp) return res.status(400).json({ message: "OTP is required." });

        const order = await Order.findById(orderId)
            .populate('userId', '-password -address')
            .populate('productDetails.item')
            .populate('deliveryPersonId', '-password');

        if (!order) return res.status(404).json({ message: "Order not found." });

        // if (order.deliveryPersonId.toString() !== deliveryPersonId) {
        //     return res.status(403).json({ message: "You are not authorized to update this order." });
        // }

        if (order.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        order.orderStatus = "Delivered";
        order.otp = null; // Clear the OTP as it is no longer needed

        const totalOrderValue = order.productDetails.reduce((acc, item) => acc + item.totalPrice, 0);
        const totalDeliveryPersonEarnings = Math.ceil(totalOrderValue * 0.08);
        const totalShopKeeperEarnings = Math.ceil(totalOrderValue * 0.87);
        const totalAdminEarnings = totalOrderValue - totalDeliveryPersonEarnings - totalShopKeeperEarnings;

        const [user, deliveryPerson, admin, shopkeeper] = await Promise.all([
            User.findById(order.userId._id),
            User.findById(order.deliveryPersonId._id),
            User.findOne({ role: 'Admin' }),
            User.findOne({ shopId: order.shopId })
        ]);

        user.coins -= totalOrderValue;
        deliveryPerson.coins += totalDeliveryPersonEarnings;
        admin.coins += totalAdminEarnings;

        const transactions = await Promise.all([
            new Transaction({
                userId: user._id,
                coinsEarned: 0,
                coinsSpent: totalOrderValue,
                orderId: order._id,
                title: "Order Debit"
            }).save(),
            new Transaction({
                userId: deliveryPerson._id,
                coinsEarned: totalDeliveryPersonEarnings,
                coinsSpent: 0,
                orderId: order._id,
                title: "Delivery Credit"
            }).save(),
            new Transaction({
                userId: shopkeeper._id,
                coinsEarned: totalShopKeeperEarnings,
                coinsSpent: 0,
                orderId: order._id,
                title: "Order Credit"
            }).save(),
            new Transaction({
                userId: admin._id,
                coinsEarned: totalAdminEarnings,
                coinsSpent: 0,
                orderId: order._id,
                title: "Order Commission"
            }).save()
        ]);

        user.transactionHistory.push(transactions[0]);
        deliveryPerson.transactionHistory.push(transactions[1]);
        shopkeeper.transactionHistory.push(transactions[2]);
        admin.transactionHistory.push(transactions[3]);

        await Promise.all([user.save(), deliveryPerson.save(), shopkeeper.save(), admin.save(), order.save()]);

        sendMessageToSocketId(user.socketId, {
            event: "transaction-event-trigger",
            data: await User.findById(user._id).populate("friendList.id")
        })

        sendMessageToSocketId(deliveryPerson.socketId, {
            event: "transaction-event-trigger",
            data: await User.findById(deliveryPerson._id).populate("friendList.id")
        })

        sendMessageToSocketId(shopkeeper.socketId, {
            event: "transaction-event-trigger",
            data: await User.findById(shopkeeper._id)
        })

        sendMessageToSocketId(admin.socketId, {
            event: "transaction-event-trigger",
            data: await User.findById(admin._id)
        })

        return res.status(200).json({
            message: "Order processed and marked as delivered successfully.",
            order: await Order.findById(orderId),
            user: order.userId._id
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getOrderHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const shop = await Shop.findOne({ owner: userId });

        const orders = await Order.find({ shopId: shop?._id })
            .populate('userId', '-password')
            .populate('productDetails.item')
            .populate('deliveryPersonId')
            .populate('shopId')
            .populate({
                path: 'productDetails.item',
                populate: {
                    path: 'shopkeeperId',
                    model: 'User',
                },
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        res.status(200).json({
            message: "Order history retrieved successfully.",
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};