import express from 'express';
import { protectRoute } from '../middlewares/auth.user.js';
import { addToCart, findAOrder, getCart, orderCart, processOrder, removeItemFromCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/getcart/:userId', getCart);
router.post('/add', addToCart);
router.post('/remove', removeItemFromCart);

router.post('/order', orderCart);
router.post('/order/process', processOrder);
router.get('/order/:userId', findAOrder);

export default router;