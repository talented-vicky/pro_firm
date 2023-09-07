// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    referralCount: { type: Number, default: 0 },
    referralCode: { type: String},
    referredBy: { type: String},
    purchasedProducts: [
      {
        productId: { type: String, required: true },
        productTitle: { type: String, required: true },
        productPrice: { type: Number, default: 0 },
        productCycle: { type: Number, default: 0 },
        productDailyIncome: { type: Number, default: 0 },
        productTotalIncome: { type: Number, default: 0 },
        purchaseLimit: { type: Number, default: 0 },
        purchased: {type: Boolean, default: false}, 
        purchaseDate: { type: Date },
        totalIncome: { type: Number, default: 0 }
      },
    ],
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
