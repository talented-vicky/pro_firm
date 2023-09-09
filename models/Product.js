const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productTitle: { 
      type: String, 
      required: true 
    },
    productPrice: { 
      type: Number, 
      default: 0 
    },
    productCycle: { 
      type: Number, 
      default: 0
    },
    productDailyIncome: { 
      type: Number, 
      default: 0
    },
    productTotalIncome: { 
      type: Number, 
      default: 0
    },
    purchaseLimit: { 
      type: Number, 
      default: 0
    },
    referrals: { 
      type: Number, 
      default: 0
    },
    productInfo1: { 
      type: String, 
      required: true 
    },
    productInfo2: { 
      type: String, 
      required: true 
    },
    productInfo3: { 
      type: String, 
      required: true 
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);