import express from 'express';
import { addFriend, deleteFriend, editProfile, getAllUsers, getOrdersForShop, getProfile, getTransactionHistory, loginUser, logoutUser, registerUser, sendFriendRequest, startAcceptingOrders } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.user.js';
import { transferCoins, verifyShop } from '../controllers/admin.controller.js';
import { sendOtp, verifyOtp } from '../controllers/otp.controller.js';

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
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// FRIENDS

router.post('/send-request', sendFriendRequest)
router.post('/add-friend', addFriend)
router.post('/remove-friend', deleteFriend)

// ADMIN
router.post('/verify-shop', verifyShop);
// router.post('/reject-shop', verifyShop);
router.post('/transfer-points', transferCoins);

export default router;