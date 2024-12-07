import { log } from 'console';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

export const getProductsForShopkeeper = async (req, res) => {
    try {
        const { userId } = req.body;
        log(userId);
        if (!userId) res.status(400).json({ message: "User NOT found." });

        const products = await Product.find({shopkeeperId: userId});
        log(products);
        if (!products) res.status(400).json({ message: "Products NOT found." });

        res.status(200).json({ 
            products
        });
    } catch (error) {
        log(error);
    }
}

export const addProduct = async (req, res) => {
    try {
        const {userId, productName, price, stock, shopName} = req.body;

        if (!productName || !price || !stock) {
            return res.status(400).json({
                message: "Every field is required."
            })
        }

        const shopOwner = await User.findById(userId);

        const newProduct = new Product({
            shopkeeperId: userId, 
            productName, price, stock, 
            shopName: shopOwner.shopName
        });

        await newProduct.save()

        res.status(201).json({
            message: "Product added successfully!"
        })
    } catch (error) {
        log(error);
    }
}