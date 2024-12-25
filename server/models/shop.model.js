import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    shopImage: {
        type: String,
        required: true,
    },
    shopRating: [{rater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, rating: {
        type: Number
    }}],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    menu: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }]
})

const Shop = mongoose.model('Shop', shopSchema)

export default Shop;