import express from 'express';
import { protectRoute } from '../middlewares/auth.user.js';
import { addToCart, getCart, removeItemFromCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/getcart/:userId', getCart);
router.post('/add', addToCart);
router.post('/remove', removeItemFromCart);

export default router;