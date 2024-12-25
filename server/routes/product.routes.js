import express from 'express';
import { addProduct, deleteProduct, getMenuByShopkeeperId, getProductsForShopkeeper } from '../controllers/product.controller.js';
import { protectRoute } from '../middlewares/auth.user.js';

const router = express.Router();

router.get('/:shopId', getProductsForShopkeeper);
router.get('/menu/:userId', getMenuByShopkeeperId);
router.get('/delete/:productId', deleteProduct);
router.post('/add', addProduct);

export default router;