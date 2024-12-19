import express from 'express';
import { protectRoute } from '../middlewares/auth.user.js';
import { addToCart, getCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/getcart/:userId', getCart);
router.post('/add', addToCart);

export default router;