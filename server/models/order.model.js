import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productDetails: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Delivered'],
    default: 'Pending',
  },
  prePayment: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
