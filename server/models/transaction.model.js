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
  