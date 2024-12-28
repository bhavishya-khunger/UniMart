const printerSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  queue: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrintFile',
    },
  ],
  }, { timestamps: true });
  
const Printer = mongoose.model('Printer', printerSchema);
export default Printer;
