import express from 'express';
import { addProduct, getProductsForShopkeeper } from '../controllers/product.controller.js';
import { addToCart } from '../controllers/cart.controller.js';
import { protectRoute } from '../middlewares/auth.user.js';

const router = express.Router();

router.get('/:shopId', getProductsForShopkeeper);
router.post('/add', addProduct);
router.post('/add-to-cart', addToCart);

export default router;