// backend/routes/authRoutes.js
const express = require('express');
const productController = require('../controllers/productController');
const withdrawalController = require('../controllers/withdrawalController')
const verifyToken = require('../middleware/authMiddleware'); 

const router = express.Router();
// just for backend route
router.post('/product/add', productController.addProduct)

// Protected route
router.get('/protected', productController.getProducts);

router.get('/products/:productId', verifyToken, productController.getOneProduct);

router.post('/', verifyToken, productController.postPurchasedProducts)

router.get('/purchased', verifyToken, productController.getPurchasedProducts)

router.post('/postTotalAmount', verifyToken, productController.postTotalAmount);


router.post('/withdrawalRequest', verifyToken, withdrawalController.postWithdrawalDetails)
   

module.exports = router;