const printerSchema = new mongoose.Schema({
    printerId: {
      type: String,
      unique: true,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    queue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    status: {
      type: String,
      enum: ['Accepted', 'Queued', 'Printed', 'Pending'],
      default: 'Pending',
      required: true,
    },
  }, { timestamps: true });
  
  const Printer = mongoose.model('Printer', printerSchema);
  export default Printer;
  