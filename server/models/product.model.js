const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
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
      default: 0,
    },
    ratings: [
      {
        score: { type: Number, min: 1, max: 5 },
        review: { type: String },
      },
    ],
  }, { timestamps: true });
  
  const Product = mongoose.model('Product', productSchema);
  export default Product;
  