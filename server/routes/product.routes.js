import express from 'express';
import { addProduct, getProductsForShopkeeper } from '../controllers/product.controller.js';
import { protectRoute } from '../middlewares/auth.user.js';

const router = express.Router();

router.get('/:shopId', getProductsForShopkeeper);
router.post('/add', addProduct);

export default router;