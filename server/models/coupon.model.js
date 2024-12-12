import mongoose, { Types } from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        maxlength: 15
    },
    discountPercentage: {
        type: Number,
        min: 10,
        max: 60,
        required: true,
    },
    maxDiscount: {
        type: Number,
    },
    shopOwner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    requirement: {
        type: Number,
        required: true,
    },
    usage: {
        type: Number,
        required: true,
        min: 1,
    }
})

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;