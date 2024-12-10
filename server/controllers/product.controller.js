import { log } from 'console';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Coupon from '../models/coupon.model.js';

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
        const {userId, productName, price, stock, productImg} = req.body;

        if (!productName || !price || !stock || !productImg) {
            return res.status(400).json({
                message: "Every field is required."
            })
        }

        const shopOwner = await User.findById(userId);

        const newProduct = new Product({
            shopkeeperId: userId, 
            productName, price, stock, 
            shopName: shopOwner.shopName,
            productImg
        });

        await newProduct.save()

        res.status(201).json({
            message: "Product added successfully!",
            newProduct
        })
    } catch (error) {
        log(error);
    }
}

export const createCoupon = async (req, res) => {
    try {
        const {code, discountPercentage, usage, maxDiscount, userId, requirement} = req.body;
        if (!code || !discountPercentage || !userId || !requirement || !usage) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }
        const owner = await User.findById(userId);
        if (!owner) {
            return res.status(400).json({
                message: "Shop not found."
            })
        }
        const preexistingCode = await Coupon.findOne({code});
        if (preexistingCode) {
            return res.status(400).json({ message: "Coupon Code NOT available." });
        }
        const coupon = new Coupon({
            code, discountPercentage, maxDiscount, 
            shopOwner: userId, 
            requirement,
            usage
        });
        await coupon.save();
        owner.coupons.push(coupon);
        return res.status(201).json({
            message: "Coupon Created!"
        })
    } catch (error) {
        log(error);
    }
}