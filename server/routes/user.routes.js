import express from 'express';
import { getOrderHistory, getProfile, getTransactionHistory, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.user.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)
router.get('/profile', protectRoute, getProfile)
router.get('/transactions/:userId', getTransactionHistory)
router.get('/orders', protectRoute, getOrderHistory)

export default router;