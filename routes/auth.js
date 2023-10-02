// backend/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator')


const authController = require('../controllers/auth');
const User = require('../models/user')

const router = express.Router();


// backend developer ---
router.get('/user/:userId', authController.getUser)

router.get('/users', authController.getUsers)

// USER
router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (val, { req }) => {
            const oldUser = await User.findOne({ email: val})
            if(oldUser) return Promise.reject("Email Already Exists")
        }),
    body('password')
        .trim()
        .isLength({min: 8})
        .withMessage("Password must be at least 8 digits")
], authController.signUp);

router.post('/signin', authController.signIn);

   

module.exports = router;
