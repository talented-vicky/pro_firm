const express = require('express');

const productCtrl = require('../controllers/product');
const withdrawalCtrl = require('../controllers/withdrawal')
const paymentCtrl = require('../controllers/payment')
const verifyToken = require('../middleware/auth'); 

const router = express.Router();

// just for backend route
router.post('/product/add', productCtrl.addProduct)

router.delete('/product/delete/:prodId', productCtrl. deleteProduct)


// Protected route for products
router.get('/protected', productCtrl.getProducts);

router.get('/products/:productId', productCtrl.getOneProduct);

router.post('/', verifyToken, productCtrl.postPurchasedProducts)

router.get('/purchased', verifyToken, productCtrl.getPurchasedProducts)

router.post('/postTotalAmount', verifyToken, productCtrl.postTotalAmount);


// PAYSTACK PAYMENT 
router.post('/paystack/accept', paymentCtrl.acceptPayment)

router.get('/paystack/verify/?reference', paymentCtrl.verifyPayment)

router.get('/paystack/webhook', paymentCtrl.verifyPayment)


// WITHDRAWAL
router.post('/withdrawalRequest', verifyToken, withdrawalCtrl.postWithdrawalDetails)

router.get('/withdrawal/profit', withdrawalCtrl.getProfits)
   

module.exports = router;