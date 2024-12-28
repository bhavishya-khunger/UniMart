import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productDetails: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }, totalPrice: Number
  }],
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  prePayment: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: String,
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
