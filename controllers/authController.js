// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  console.log('email:', email)

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials -- email' 
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials -- password' 
      });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: 1800 });
    res.status(200).json({ user, token });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.signUp = async (req, res) => {
  // user enters a referral code
  const { email, password, referralcode } = req.body;
  let referredBy

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // check for existence of input referralCode in user database
    const validReferral = await User.findOne({ 
      "purchasedProducts.referralCode": referralcode 
    })
    if(!validReferral){
      const error = new Error("Referral Does not")
      error.statusCode
      //
      throw error
    } else if(validReferral){
      // update referral count of user with this referralcode
      const user = await User.findOneAndUpdate(
        {_id: validReferral._id}, { $inc: { referralCount: 1 }}
      )
      await user.save()

      // set the "referralCode" of anonymous user as current user's "referredBy"
      referredBy = validReferral.purchasedProducts.referralCode
    }

    // create random code for referral
    const referralCode = Math.random().toString(36).substring(2, 12)
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({ 
      email, password: hashedPassword,  referralCode, referredBy
    });

    // // Generate a JWT token
    // // why boss??
    // const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: 1800 });
    // console.log('token',token)
    res.status(201).json({ newUser, token, referralCode });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



