// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    referralCount: { 
      type: Number, 
      default: 0 
    },
    referralCode: { 
      type: String
    },
    referredBy: { 
      type: String
    },
    purchasedProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
