import express from 'express';
import { protectRoute } from '../middlewares/auth.user.js';
import { addToCart, cancelOrder, confirmOrder, findAOrder, getActiveOrdersByDeliveryPerson, getCart, markOrderAsDelivered, markOrderForPickup, markOrderOutForDelivery, orderCart, processOrder, removeItemFromCart, sendRequest } from '../controllers/cart.controller.js';
import { postPrintOrder } from '../controllers/printer.controller.js';

const router = express.Router();

router.get('/getcart/:userId', getCart);
router.post('/add', addToCart);
router.post('/remove', removeItemFromCart);

router.post('/order', orderCart);
router.post('/order/process', processOrder);
router.get('/order/:userId', findAOrder);
router.get('/order/delivery/:deliveryPersonId', getActiveOrdersByDeliveryPerson);

router.post('/order/request', sendRequest);
router.post('/order/confirm', confirmOrder);
router.post('/order/cancel', cancelOrder); 
router.post('/order/markForPickup', markOrderForPickup); 
router.post('/order/markForDelivery', markOrderOutForDelivery);
router.post('/order/markDelivered', markOrderAsDelivered);

// Printing Routes

router.post('/print/request', postPrintOrder);
export default router;