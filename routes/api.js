const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product');
const withdrawalCtrl = require('../controllers/withdrawal')
const paymentCtrl = require('../controllers/payment')
const verifyToken = require('../middleware/auth'); 



// Protected route for products
router.get('/products', verifyToken, productCtrl.getProducts);

router.get('/products/:productId', verifyToken, productCtrl.getOneProduct);

router.post('/products/:productId', verifyToken, productCtrl.postPurchaseProduct)

router.get('/product/purchased', verifyToken, productCtrl.getPurchasedProducts)

router.post('/product/totalamount', verifyToken, productCtrl.postTotalAmount);


// PAYSTACK PAYMENT 
router.post('/paystack/init/payment', verifyToken, paymentCtrl.acceptPayment)

router.post('/paystack/accept', verifyToken, paymentCtrl.acceptPayment)

router.get('/paystack/verify/?reference', verifyToken, paymentCtrl.verifyPayment)

router.get('/paystack/webhook', verifyToken, paymentCtrl.webhook)


// WITHDRAWAL
router.post('/withdrawal/request', verifyToken, withdrawalCtrl.postWithdrawalDetails)

router.get('/withdrawal/profit', verifyToken, withdrawalCtrl.getProfits)
   

module.exports = router;