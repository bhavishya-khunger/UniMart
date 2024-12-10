import express from 'express';
import { getOrderHistory, getProfile, getTransactionHistory, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.user.js';
import { addToCart, removeItemFromCart } from '../controllers/cart.controller.js';

const router = express.Router();

// Register, Login and Logout
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Profile Routes
router.get('/profile', protectRoute, getProfile);
router.get('/transactions', protectRoute, getTransactionHistory);
router.get('/orders', protectRoute, getOrderHistory);

// Cart Routes
router.post('/cart/add', protectRoute, addToCart);
router.post('/cart/remove', protectRoute, removeItemFromCart);

export default router;