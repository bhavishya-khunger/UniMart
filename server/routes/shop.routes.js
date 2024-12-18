import express from 'express';
import { protectRoute } from '../middlewares/auth.user.js';
import { createShop, getAllShops } from '../controllers/shop.controller.js';

const router = express.Router();

router.get('/get-shops', getAllShops);
router.post('/create-shop', createShop);

export default router;