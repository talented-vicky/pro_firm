const express = require('express')
const router = express.Router()

const adminCtrl = require('../controllers/admin')


// ADMIN
router.post('/product/add', adminCtrl.addProduct)

router.put('/product/edit', adminCtrl.editProduct)

router.delete('/product/delete/:prodId', adminCtrl.deleteProduct)



module.exports = router