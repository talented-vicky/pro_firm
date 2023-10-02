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
    parentRef: { 
      type: String,
    },
    grandRef: { 
      type: String
    },
    greatRef: { 
      type: String
    },
    purchasedDetails: [
      {
        title: { 
          type: String,
          required: true 
        },
        limit: { 
          type: Number,
          required: true 
        },
        amount: { 
          type: Number,
          default: 0
        },
        date: {
          type: Date, 
          default: Date.now()
        }
      }
    ],
    purchasedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
