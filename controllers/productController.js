const Product = require('../models/Product')
const User = require('../models/User')

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
    const newProduct = await product.save() 
    res.status(200).json({
      message: "Successfully Added Product",
      data: newProduct
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// FETCHING PRODUCTS
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        noData(products)
        res.status(200).json({
          message: "Successfully Fetched Products", 
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


// BUYING PRODUCTS
exports.postPurchasedProducts = async (req, res) => {
  const { 
    productId, productTitle, productPrice, productCycle, productDailyIncome, 
    productTotalIncome, purchaseLimit, referrals, now } = req.body;

  try {
    const user = await User.findById(req.userId); 
    unAuthorized(user)
    
    const existingProductIndex = user.purchasedProducts.findIndex(
      (productObj) => productObj.productId === productId
    );

    let newUser;
    if (existingProductIndex !== -1) {
      // Increment purchase limit if it's not 0
      console.log('product exists')
      if (user.purchasedProducts[existingProductIndex].purchaseLimit !== 0) {
        newUser = user.purchasedProducts[existingProductIndex].purchaseLimit -= 1;
      }
    } else if (purchaseLimit !== 0) { 
      // If purchaseLimit is != 0, add the product to purchasedProducts array
      const product = new Product({
        productTitle, productPrice, productCycle, productDailyIncome,
        productTotalIncome, purchaseLimit: purchaseLimit - 1, referrals, 
        purchaseDate: now, totalIncome: productTotalIncome });
      newUser = user.purchasedProducts.push(product)
    }
    const savedUser = await newUser.save()

    res.status(201).json({ 
      message: 'Successfully added product to user details',
      data: savedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to purchased' });
  }
}

exports.getPurchasedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    unAuthorized(user)
    res.status(200).json({
      message: "Successfully Fetched Purchased Producst",
      data: user.purchasedProducts
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

















// added
exports.getPurchasedProducts = async (req, res) => {
  try {
    // Get the user from authentication
    const user = await User.findById(req.userId);
    unAuthorized(user) 
    res.status(200).json({
      message: "Successfully Fetched Purchased Product",
      data: user.purchasedProducts
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchased products' });
  }
}

exports.postPurchasedProducts = async (req, res) => {
  const { productTitle, productPrice, productCycle, productDailyIncome, 
    productTotalIncome, purchaseLimit, referrals, now } = req.body;

  try {
    const user = await User.findById(req.userId); 
    unAuthorized(user)

    const product = new Product({
      productTitle, productPrice, productCycle, productDailyIncome,
      productTotalIncome, purchaseLimit: purchaseLimit - 1,
      referrals, purchaseDate: now, totalIncome: productTotalIncome });

    const newUser = user.purchasedProducts.push(product)
    const result = await newUser.save()

    res.status(201).json({ 
      message: 'Successfully added product to user details',
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to purchased' });
  }
}

exports.postTotalAmount = async (req, res) => {
  const { purchasedProduct, totalAmount } = req.body;  

  try {
    // Get the user from authentication
    const user = await User.findById(req.userId);
    unAuthorized(user) 

    if (existingProductIndex !== -1) {
      // Update the total income of the purchased product
      user.purchasedProducts[existingProductIndex].totalIncome = totalAmount;      
      // Save the updated user document
      await user.save();

      return res.status(200).json({ message: 'Total amount posted successfully.' });
    } else {
      return res.status(404).json({ message: 'Product not found in purchased products.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error posting total amount.' });
  }
};