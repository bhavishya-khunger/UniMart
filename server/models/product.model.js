import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    productImg: {
      type: String,
      required: true, 
      default: "",
    },
    shopkeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      // default: 0,
    },
    ratings: [
      {
        score: { type: Number, min: 1, max: 5 },
        review: { type: String },
      },
    ],
    isVeg: {
      type: Boolean,
      default: true,
    },
  }, { timestamps: true });
  
  const Product = mongoose.model('Product', productSchema);
  export default Product;
  