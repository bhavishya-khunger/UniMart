import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coinsEarned: {
      type: Number,
      required: true,
    },
    coinsSpent: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      enum: ["Order Debit", "Refund", "Delivery Credit", "Referal Bonus", "Order Credit", "Order Commission"]
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });
  
  const Transaction = mongoose.model('Transaction', transactionSchema);
  export default Transaction;
  