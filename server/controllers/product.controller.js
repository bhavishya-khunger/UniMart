import { log } from 'console';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Shop from '../models/shop.model.js';

export const getMenuByShopkeeperId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ message: "User ID not provided." });
        }

        // Fetch shop and populate menu
        const shop = await Shop.findOne({ owner: userId }).populate('menu');

        // Check if shop exists
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        // Check if menu/products exist
        if (!shop.menu || shop.menu.length === 0) {
            return res.status(404).json({ message: "No products found for this shop." });
        }

        // Return products
        res.status(200).json({ products: shop.menu, shopName: shop.shopName });
    } catch (error) {
        console.error("Error fetching products for shopkeeper:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getProductsForShopkeeper = async (req, res) => {
    try {
        const { shopId } = req.params;
        log(shopId);

        // Check if shopId is provided
        if (!shopId) {
            return res.status(400).json({ message: "Shop ID not provided." });
        }

        // Fetch shop and populate menu
        const shop = await Shop.findById(shopId).populate('menu');

        // Check if shop exists
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        const products = shop.menu;

        // Check if menu/products exist
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this shop." });
        }

        // Return products
        res.status(200).json({ products, shopName: shop?.shopName });
    } catch (error) {
        console.error("Error fetching products for shopkeeper:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { userId, productName, price, productImg, isVeg, desc } = req.body;

        if (!productName || !price || !productImg || isVeg === undefined || isVeg === null || !desc) {
            return res.status(400).json({
                message: "Every field is required."
            })
        }

        const newProduct = new Product({
            shopkeeperId: userId,
            productName, price, isVeg, desc,
            productImg
        });

        const shop = await Shop.findOne({ owner: userId });
        if (!shop) res.status(400).json({ message: "Shop NOT found." });

        shop.menu.push(newProduct._id);
        await shop.save();
        await newProduct.save();

        res.status(201).json({
            message: "Product added successfully!",
            newProduct
        })
    } catch (error) {
        log(error);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const {productId} = req.params;

        if (!productId) res.status(400).json({message: "No Product ID found."});

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            message: "Product Deleted!",
        })
    } catch (error) {
        console.log(error);
    }
}