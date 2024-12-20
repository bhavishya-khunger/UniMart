import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  prePayment: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
