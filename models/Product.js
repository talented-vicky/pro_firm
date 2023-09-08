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



// const Product = [
//     {
//       productId: 'F-p3',
//       productTitle: 'F-p3',
//       productPrice: 3000,
//       productCycle: 3,
//       productDailyIncome: 150,
//       productTotalIncome: 4500,
//       purchaseLimit: 1,
//       referrals: 0,
//       productInfo1: '1. Purchase F-P3, the purchase amount is 3000.00NGN, the daily income is 150.00NGN, the income cycle is 30 days, and the total income is 4500.00NGN. Purchase today, start your income tomorrow, you need to open the app every day, click to receive your income!',
//       productInfo2: '2. The product can only be purchased once and no referral needed.',
//       productInfo3: '3. Invite friends to earn team commission'
//     },

//     {
//       productId: 'F-p6',
//       productTitle: 'F-p6',
//       productPrice: 6000,
//       productCycle: 3,
//       productDailyIncome: 320,
//       productTotalIncome: 9600,
//       purchaseLimit: 1,
//       referrals: 0,
//       productInfo1: '1. Purchase F-P6, the purchase amount is 6000.00NGN, the daily income is 320.00NGN, the income cycle is 30 days, and the total income is 9600.00NGN. Purchase today, start your income tomorrow, you need to open the app every day, click to receive your income!',
//       productInfo2: '2. The product can only be purchased once and no referral needed.',
//       productInfo3: '3. Invite friends to earn team commission'
//     },

//     {
//       productId: 'F-p15',
//       productTitle: 'F-p15',
//       productPrice: 15000,
//       productCycle: 40,
//       productDailyIncome: 689,
//       productTotalIncome: 27560,
//       purchaseLimit: 2,
//       referrals: 3,
//       productInfo1: '1. Purchase F-P15, the purchase amount is 15000.00NGN, the daily income is 689.00NGN, the income cycle is 40 days, and the total income is 27560.00NGN. Purchase today, start your income tomorrow, you need to open the app every day, click to receive your income!',
//       productInfo2: '2. The product can only be purchased twice and requires 3 referrals.',
//       productInfo3: '3. Invite friends to earn team commission'
//     },

//     {
//       productId: 'F-p25',
//       productTitle: 'F-p25',
//       productPrice: 25000,
//       productCycle: 40,
//       productDailyIncome: 1100,
//       productTotalIncome: 44000,
//       purchaseLimit: 2,
//       referrals: 3,
//       productInfo1: '1. Purchase F-P25, the purchase amount is 25000.00NGN, the daily income is 1100.00NGN, the income cycle is 40 days, and the total income is 44000.00NGN. Purchase today, start your income tomorrow, you need to open the app every day, click to receive your income!',
//       productInfo2: '2. The product can only be purchased twice and requires 3 referrals.',
//       productInfo3: '3. Invite friends to earn team commission'
//     },

//     {
//       productId: 'F-p52',
//       productTitle: 'F-p52',
//       productPrice: 52000,
//       productCycle: 50,
//       productDailyIncome: 1100,
//       productTotalIncome: 113625,
//       purchaseLimit: 3,
//       referrals: 5,
//       productInfo1: '1. Purchase F-P52, the purchase amount is 52500.00NGN, the daily income is 2525.00NGN the income cycle is 50 days, and the total income is 113625.00NGN. Purchase today, start your income tomorrow, you need to open the app every day, click to receive your income!',
//       productInfo2: '2. The product can only be purchased thrice and requires 5 referrals.',
//       productInfo3: '3. Invite friends to earn team commission'
//     },

//     {
//       productId: 'F-p85',
//       productTitle: 'F-p85',
//       productPrice: 85000,
//       productCycle: 50,
//       productDailyIncome: 4150,
//       productTotalIncome: 186750,
//       purchaseLimit: 3,
//       referrals: 5,
//       productInfo1: 'Purchase F-P85, the purchase amount is 85000.00NGN, the daily income is 4150.00NGN, the income cycle is 50 days, and the total income is 186750.00NGN. Purchase today, start your income tomorrow, you need to open the app every day, click to receive your income!',
//       productInfo2: '2. The product can only be purchased thrice and requires 5 referrals.',
//       productInfo3: '3. Invite friends to earn team commission'
//     }
// ]

// module.exports = Product