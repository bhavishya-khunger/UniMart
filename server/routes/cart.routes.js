import express from 'express';
import { protectRoute } from '../middlewares/auth.user.js';
import { addToCart, confirmOrder, findAOrder, getCart, orderCart, processOrder, removeItemFromCart, sendRequest } from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/getcart/:userId', getCart);
router.post('/add', addToCart);
router.post('/remove', removeItemFromCart);

router.post('/order', orderCart);
router.post('/order/process', processOrder);
router.get('/order/:userId', findAOrder);

router.post('/order/request', sendRequest);
router.post('/order/confirm', confirmOrder);

export default router;