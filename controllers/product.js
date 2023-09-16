const Product = require('../models/product')
const User = require('../models/user')

const noData = (data) => {
  if(!data){
    const error = new Error("Product Not Found")
    error.statusCode = 402
    throw error
  }
}

const unAuthorized = (user) => {
  if(!user){
    const error = new Error("Unauthorized Access")
    error.statusCode = 403
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

  } catch (error) {
    res.status(500).json({ message: error.message });
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
  } catch (error) {
    res.status(400).json({message: "Error Occured"})
  }
}



// FETCHING PRODUCTS
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        noData(products)
        const totalProduct = await Product.find().countDocuments()
        res.status(200).json({
          message: "Successfully Fetched Products", 
          qty: totalProduct,
          data: products
        });

      } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getOneProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      noData(product)
      res.status(200).json({
        message: "Successfully Fetched Product",
        data: product
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};



// PURCHASING PRODUCTS
exports.postPurchaseProduct = async (req, res) => {
  const { productId } = req.params

  try {
    // const user = await User.findById(req.userId).populate('purchasedProducts'); 
    const user = await User.findById("65012f49674862d85782d14b").populate('purchasedProducts'); 
    unAuthorized(user)
    
    console.log(user)

    const product = await Product.findById(productId)
    if(!product){
      const error = new Error("Product Not Found")
      error.statusCode = 404
      throw error
    }

    user.purchasedProducts.forEach(prod => {
      console.log(prod)
      // comment all other codes below this


      if(prod._id !== productId){
        // firs time user wants to purchase this product 
        const existingProduct = {
          title: prod.productTitle, limit: prod.purchaseLimit - 1,
        }
        user.purchasedDetails.push(existingProduct)
        user.purchasedProducts.push(product)
        // user.save()

      } else if(prod._id == productId){
        // user wants to purchase product again
        user.purchasedDetails.forEach(p => {
          if(p.title === product.productTitle){
            if(p.limit == 0){
              const error = new Error(`You can't purchase this product more than ${product.purchaseLimit} times`)
              error.statusCode = 402
              throw error
            } else if(p.limit > 0){ p.limit -= 1 }
          }
        })
        // user.save()
      }
    })
    res.status(200).json({message: "done testing"})

    // res.status(201).json({ 
    //   message: 'Successfully added product to user details',
    //   purchaseLimit: stuff,
    //   data: savedUser
    // });

  } catch (error) {
    res.status(500).json({ message: 'Error adding product to purchased' });
  }
}

exports.getPurchasedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('purchasedProducts');
    unAuthorized(user)
    const { purchasedProducts } = user

    res.status(200).json({
      message: "Successfully Fetched Purchased Producst",
      data: purchasedProducts
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchased products' });
  }
}

exports.postTotalAmount = async (req, res) => {
  const { purchasedProduct, totalAmount } = req.body;

  try {
    const user = await User.findById(req.userId); 
    unAuthorized(user)

    // Check if the product already exists in purchasedProducts
    const existingProductIndex = user.purchasedProducts.findIndex(
      (productObj) => productObj.productId === purchasedProduct.productId
    );
    if (existingProductIndex !== -1) {
      // Update the total income of the purchased product
      user.purchasedProducts[existingProductIndex].totalIncome = totalAmount;      
      // Save the updated user document
      await user.save();
      return res.status(200).json({ 
        message: 'Total amount posted successfully.' 
      });
    } else {
      return res.status(404).json({ 
        message: 'Product not found in purchased products.' 
      });
    }

  } catch (error) {
    return res.status(500).json({ message: 'Error posting total amount.' });
  }
};
