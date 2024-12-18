import Shop from "../models/shop.model.js";

export const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find({});

        if (!shops) return res.status(400).json({
            message: "No Shops Found Near You."
        });

        return res.status(200).json({shops});
    } catch (error) {
        console.log(error);
    }
}

export const createShop = async (req, res) => {
    try {
        const {shopName, shopImage, owner} = req.body;
        if (!shopName || !shopImage || !owner) return res.status(400).json({message: "All fields are required."});
        const newShop = new Shop({shopImage, shopName, owner});
        await newShop.save();
        return res.status(201).json({message: "Restaurant Listed."});

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error});
    }
}