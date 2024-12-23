import express from 'express';
import { editProfile, getOrdersForShop, getProfile, getTransactionHistory, loginUser, logoutUser, registerUser, startAcceptingOrders } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.user.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/edit', editProfile)
router.get('/logout', logoutUser)
router.get('/profile', protectRoute, getProfile)
router.get('/transactions/:userId', getTransactionHistory)
router.get('/orders/:userId', getOrdersForShop)
router.post('/accept-orders', startAcceptingOrders)

export default router;