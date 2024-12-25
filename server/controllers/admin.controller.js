import Shop from "../models/shop.model.js";

export const verifyShop = async (req, res) => {
    try {
        const { shopId } = req.body;
        if (!shopId) return res.status(400).json({
            message: "No ShopID Found.",
        })
        
        const shop = await Shop.findByIdAndUpdate(shopId, { verified: true });

        return res.status(200).json({
            message: "Shop verified!",
            shop
        })
    } catch (error) {
        console.log(error);
    }
}