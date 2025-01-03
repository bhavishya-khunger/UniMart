import express from 'express';
import { protectRoute } from '../middlewares/auth.user.js';
import { cancelPrintOrder, createShop, getAllShops, getPrinters, getPrintOrders, getUnverifiedShops, markPrintAsPickedUp, markPrintForPickup } from '../controllers/shop.controller.js';

const router = express.Router();

router.get('/get-shops', getAllShops);
router.get('/get-unverified', getUnverifiedShops);
router.post('/create-shop', createShop);

// Print
router.get('/get-printers', getPrinters);
router.get('/get-print-orders/:userId', getPrintOrders);
router.post('/mark-order-completed', markPrintForPickup);
router.post('/mark-as-picked', markPrintAsPickedUp);
router.post('/mark-as-cancelled', cancelPrintOrder);

export default router;