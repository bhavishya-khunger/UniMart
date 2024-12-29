import express from 'express';
import { addFriend, deleteFriend, editProfile, getAllUsers, getOrdersForShop, getProfile, getTransactionHistory, loginUser, logoutUser, registerUser, sendFriendRequest, startAcceptingOrders } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.user.js';
import { verifyShop } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/edit', editProfile)
router.get('/logout', logoutUser)
router.get('/profile', protectRoute, getProfile)
router.get('/transactions/:userId', getTransactionHistory)
router.get('/orders/:userId', getOrdersForShop)
router.post('/accept-orders', startAcceptingOrders)
router.get('/all', getAllUsers)

// FRIENDS

router.post('/send-request', sendFriendRequest)
router.post('/add-friend', addFriend)
router.post('/remove-friend', deleteFriend)

// ADMIN
router.post('/verify-shop', verifyShop);

export default router;