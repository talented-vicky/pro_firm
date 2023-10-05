const Product = require('../models/product')
const User = require('../models/user')


// REUSABLE FUNCTIONS
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
    // const user = await User.findById("651ad7f0213272152351da98").populate('purchasedProducts'); 
    const user = await User.findById(req.userId).populate('purchasedProducts'); 
    unAuthorized(user)
    
    const product = await Product.findById(productId)
    noData(product)

    const jsonResp = (msg) => {
      res.status(200).json({ message: msg, data: product })
    }

    // USER HAS *NOT* MADE ANY PURCHASE
    if(user.purchasedProducts.length == 0){
      const existingProduct = {
        title: product.productTitle, limit: product.purchaseLimit - 1,
        _id: product._id
      }
      user.purchasedDetails.push(existingProduct)
      user.purchasedProducts.push(product)

      const userParent = await User.findOne(
        { referralCode: user.parentRef}
      )
      if(userParent){
        // userParent will be null if parentRef of currently logged-in
        // user isn't anybody's referralCode in the database
        console.log("this user was actually referred")
        // update referral count of existing user with this 
        // user's parentRef matching its referralCode
        await User.findOneAndUpdate(
          {referralCode: user.parentRef}, 
          { $inc: { referralCount: 1 }},
          { returnOriginal: false}
        )
      }
      user.save()
      return jsonResp("Successfully Purchased Your First Product")
    }

    // USER HAS MADE PURCHASE(S)
    // case-1 user wants to purchase this product again
    const prodFinder = arr => {
      let ans;
      for(let i = 0; i < arr.length; i++){
        // only one object will match in the end, hence returned
        if(arr[i]._id.toString() === productId){ ans = arr[i] }
      }
      return ans
    }
    
    const init = prodFinder(user.purchasedProducts)
    if(init){
      // we'll only reach here if the id already exists
      const ress = prodFinder(user.purchasedDetails)
      if(ress.limit == 0){
        const error = new Error(`You can't purchase this product more than ${product.purchaseLimit} times`)
        error.statusCode = 402
        throw error
      }
      await User.findOneAndUpdate(
        { _id: user._id, 'purchasedDetails._id': product._id},
        { $inc: { 'purchasedDetails.$.limit': -1 }},
        { returnOriginal: false }
      )
      await user.save()
      return jsonResp("Successfully Purchased Product Again")
    }

    // we'd reach here if productId isn't already in purchasedProducts
    // // case-2 first time user wants to purchase this product 
    user.purchasedProducts.push(product)
    // case-1 first time user wants to purchase this product 
    const existingProduct = {
      title: product.productTitle, limit: product.purchaseLimit - 1,
      _id: product._id
    }
    user.purchasedDetails.push(existingProduct)
    user.save()
    return jsonResp("Successfully Purchased Product")
    
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding product to purchased',
      info: error.message 
    });
  }
}

exports.getPurchasedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('purchasedProducts');
    // const user = await User.findById("650132d3b3e8a691e7fc0eb6").populate('purchasedProducts');
    unAuthorized(user)
    const { purchasedProducts } = user

    if(purchasedProducts.length == 0){
      return res.status(200).json({
        message: "You have NO Purchased Product Yet",
        data: purchasedProducts
      });
    }
    res.status(200).json({
      message: "Successfully Fetched Purchased Products",
      data: purchasedProducts
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchased products' });
  }
}

exports.postTotalAmount = async (req, res) => {
  const { productId, amount } = req.body;

  try {
    // const user = await User.findById(req.userId); 
    const user = await User.findById("65012f49674862d85782d14b"); 
    unAuthorized(user)

    const product = await Product.findById(productId)
    noData(product)
    
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, 'purchasedDetails._id': product._id },
      { $set: { 'purchasedDetails.$.amount': amount } },
      { returnOriginal: false }
    )

    return res.status(201).json({ 
      message: 'Successfully Posted Amount',
      data: updatedUser
    });

  } catch (err) {
    return res.status(500).json({ 
      message: 'Error posting total amount.',
      info: err.message 
    });
  }
};