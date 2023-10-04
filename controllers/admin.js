const Product = require('../models/product')


const noData = (data) => {
    if(!data){
      const error = new Error("Product Not Found")
      error.statusCode = 402
      throw error
    }
}

// EXTRA CONTROLLER --backend developer--
exports.addProduct = async (req, res) => {
    const { productTitle, productPrice, productCycle, productDailyIncome, 
      productTotalIncome, purchaseLimit, referrals, productInfo1,
      productInfo2, productInfo3 } = req.body;
      
    try {
      const product = new Product({
        productTitle, productPrice, productCycle, productDailyIncome, 
        productTotalIncome, purchaseLimit, referrals, productInfo1,
        productInfo2, productInfo3
      })
  
      const existingProd = await Product.findOne({ productTitle })
      if(existingProd){
        return res.status(400).json({
          message: "product with title already exists"
        })
      }
      const newProduct = await product.save() 
      res.status(200).json({
        message: "Successfully Added Product",
        data: newProduct
      })
  
    } catch (err) {
        res.status(500).json({ 
            message: "Error Adding Product",
            info: err.message 
        });
    }
  }
  
exports.deleteProduct = async (req, res) => {
    const { prodId } = req.params

    try {
        const product = await Product.findById(prodId)
        noData(product)

        prodInfo = {name: product.productTitle, id: product._id}
        await Product.findByIdAndRemove(prodId)
        await Product.save()

        res.status(200).json({
        message: "Successfully Deleted Product",
        data: prodInfo
        })
    } catch (err) {
        res.status(500).json({
            message: "Error Deleting Product",
            info: err.message
        })
    }
}
  
exports.editProduct = async (req, res) => {
    const { referrals } = req.body 
    try {
        const product = await Product.findOneAndUpdate(
            { productTitle:  'F-p25' }, { referrals },
            { returnOriginal: false }
        )
        noData(product)
        
        updatedProd = await product.save()
        res.status(200).json({
            message: "Successfully Edited Product",
            data: updatedProd
        })

    } catch (err) {
        res.status(500).json({
            message: "Error Editing Product",
            info: err.message
        })
    }
}