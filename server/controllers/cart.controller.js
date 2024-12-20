import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import Coupon from '../models/coupon.model.js';
import Product from '../models/product.model.js';
import bcrypt from 'bcrypt';
import { log } from 'console';
import Order from '../models/order.model.js';


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

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        if (cart.items.length === 0) return res.status(400).json({ message: "Cart is empty." });

        // Create order from cart
        const order = new Order({
            userId,
            productDetails: cart.items,
        });

        await order.save();

        // Clear cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({
            message: "Order placed successfully. Waiting for the acceptance!",
            order,
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

        const order = await Order.find({ userId });

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