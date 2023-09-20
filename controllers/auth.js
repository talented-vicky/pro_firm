const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    // const user = await User.findById("64fcc9411decd6401d23ba21")
    if(!user){
      const error = new Error("Oops! User Not Found")
      error.statusCode = 404
      throw error
    }
    res.status(200).json({
      message: "Fetched User Successfully",
      data: user
    })

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }

}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
    if(!users){
      const error = new Error("Users Not Found")
      error.statusCode = 404
      throw error
    }
    res.status(200).json({
      message: "Fetched Users Successfully",
      data: users
    })

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

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
  const { email, password, referralCode } = req.body;
  let parentRef, grandRef, greatRef;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    const firstRef = await User.findOne({ referralCode })    
    // no referral entered in frontend
    if(referralCode == ""){
      parentRef = "Unknown"
      grandRef = "Unknown"
      greatRef = "Unknown"
    }

    // referral not empty, but also not in database (i.e not a valid referral)
    if(referralCode != "" && !firstRef){
      const error = new Error("Invalid Referral")
      error.statusCode = 404
      throw error
    } 
    
    // referral found in database
    else if(firstRef){
      // set "referralCode" of parent user as current user's "parentReferral"
      parentRef = firstRef.referralCode
      
      // check database for the referral of parrent (first) referral
      const nextRef = await User.findOne({ referralCode: firstRef.parentRef })
      if(!nextRef){
        grandRef = "Unknown"
        greatRef = "Unknown"
      } else if(nextRef){
        grandRef = nextRef.referralCode
        greatRef = "Unknown"

        const finalRef = await User.findOne({ referralCode: nextRef.parentRef })
        if(!finalRef){
          greatRef = "Unknown"
        } else if(finalRef){
          greatRef = finalRef.referralCode
        }
      }
    }

    // create random code for referral
    const referralcode = Math.random().toString(36).substring(2, 12)
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = new User({ 
      email, password: hashedPassword,  referralCode: referralcode, 
      parentRef, grandRef, greatRef
    });
    const newUser = await user.save()
    res.status(201).json({ 
      message: "Successfully signed up",
      data: newUser, 
      referralCode: user.referralCode 
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



