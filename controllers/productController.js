const Products = require('../models/Product')
const User = require('../models/User')

exports.getProducts = (req, res) => {
    try {
        const products = Products;
        // console.log('products', products)

        //I added these lines below
        //// discuss with Tola to add his products to a database
        // for security reasons
        // const product = Products.find()
        // if(!product){
        //   const error = new Error("Error Fetching Products")
        //   error.statusCode = 402
        //   throw error
        // }
        // if(product.len)

        res.json({products});
      } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getOneProduct = (req, res) => {
    const products = Products;
    // console.log('params', req.params.productId)

    const findProductById = (productId) => {
        return products.find(product => product.productId === productId);
    };


    try {
      const product = findProductById(req.params.productId);
    //   console.log('productss', product)
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.postPurchasedProducts = async (req, res) => {
  const { 
    productId, 
    productTitle,
    productPrice, 
    productCycle,
    productDailyIncome,
    productTotalIncome,
    purchaseLimit,
    referrals,
    now
   } = req.body;

   console.log('reqBody', req.body)

  try {
    const user = await User.findById(req.userId); // Get the user from authentication

    // Check if the product already exists in purchasedProducts
    const existingProductIndex = user.purchasedProducts.findIndex(
      (productObj) => productObj.productId === productId
    );

    if (existingProductIndex !== -1) {
      // Increment purchase limit if it's not 0
      console.log('product exists')
      if (user.purchasedProducts[existingProductIndex].purchaseLimit !== 0) {
        user.purchasedProducts[existingProductIndex].purchaseLimit -= 1;
      }
    } else if (purchaseLimit !== 0) { // Only add if purchaseLimit is not 0
      // Add the product to purchasedProducts array
      user.purchasedProducts.push({
        productId,
        productTitle,
        productPrice,
        productCycle,
        productDailyIncome,
        productTotalIncome,
        purchaseLimit: purchaseLimit - 1,
        referrals,
        purchaseDate: now,
        totalIncome: productTotalIncome
      });
    }

    await user.save();

    res.status(201).json({ message: 'Product added to purchased' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to purchased' });
  }
}

exports.getPurchasedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Get the user from authentication
    res.status(200).json(user.purchasedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchased products' });
  }
}

exports.postTotalAmount = async (req, res) => {
  const { purchasedProduct, totalAmount } = req.body;
  console.log('details', req.body)
  

  try {
    const user = await User.findById(req.userId); // Get the user from authentication

    // Check if the product already exists in purchasedProducts
    const existingProductIndex = user.purchasedProducts.findIndex(
      (productObj) => productObj.productId === purchasedProduct.productId
    );

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