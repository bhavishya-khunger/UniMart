import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    enum: ['Active', 'Deactivated', 'Suspended'],
    default: 'Active',
  },
  sid: {
    type: Number,
    minlength: 8,
    maxlength: 8,
    required: function () {
      return this.role === 'Student';
    },
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: [{
    spot: {
      type: String,
    },
    details: {
      type: String,
    }
  }],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Shopkeeper', 'Admin'],
    required: true,
  },
  coins: {
    type: Number,
    default: 0,
  },
  transactionHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  isShopVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  referalCode: {
    type: String,
    unique: true,
    default: function () {
      return this.name.substring(0, 3).toUpperCase() + this.sid;
    },
  },
  agreesToDeliver: {
    type: Boolean,
    default: false,
  }
});

// to compare hashed passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// to generate token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// to verify a JWT token
userSchema.statics.verifyToken = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Export the model
const User = mongoose.model('User', userSchema);

export default User;
