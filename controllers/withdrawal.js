const nodemailer = require('nodemailer');

const User = require('../models/user')
const Product = require('../models/product')


exports.postWithdrawalDetails = async (req, res) => {
    const withdrawalData = req.body

    console.log('withdrawalData', withdrawalData)
    try {
        // Setup nodemailer transporter with your email provider's credentials
        const transporter = nodemailer.createTransport({
            // ... setup details ...
            service: 'SendGrid', // no need to set service when using SendGrid
            auth: {
                user: 'apikey', // Your SendGrid API key
                pass: 'your-sendgrid-api-key'
            }
        });

        // Compose email message
        const message = {
            from: 'adetolaadedeji0@email.com',
            to: withdrawalData.email,
            subject: 'Withdrawal Request',
            text: 'Your withdrawal request has been received and is being processed.'
        };

        // Send email
        await transporter.sendMail(message);

        res.status(200).json({ message: 'Email Sent Successfully' }); // Email sent successfully
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Email Sending Failed' }); // Internal server error
    }
}

exports.getProfits = async (req, res) => {
    try {
        let firstPerc = 0
        let secPerc = 0
        let lastPerc = 0
        // const profitQuery = (user, sum) => {
        //     if(user){
        //         user.forEach(product => {
        //             product.purchasedProducts.forEach(prod => {
        //                 sum += prod.productPrice
        //             })
        //         })
        //     }
        // }
        
        // const user = await User.findById(req.userId).populate('purchasedProducts')
        
        const user = await User.findById("65012f49674862d85782d14b")
                                .populate('purchasedProducts')
        // check authentication
        if(!user){
            const error = new Error("User Not Found")
            error.statusCode = 404
            throw error
        }
        
        const { referralCode } = user
        
        const child = await User.find({ parentRef: referralCode }).populate('purchasedProducts')
        // profitQuery(child, firstPerc)
        if(child){
            child.forEach(product => {
                product.purchasedProducts.forEach(prod => {
                    firstPerc += prod.productPrice
                })
            })
        }

        const grandChild = await User.find({ grandRef: referralCode }).populate('purchasedProducts')
        // profitQuery(grandChild, secPerc)
        if(grandChild){
            grandChild.forEach(product => {
                product.purchasedProducts.forEach(prod => {
                    secPerc += prod.productPrice
                })
            })
        }
        const greatChild = await User.find({ greatRef: referralCode }).populate('purchasedProducts')
        // profitQuery(greatChild, lastPerc)
        if(greatChild){
            greatChild.forEach(product => {
                product.purchasedProducts.forEach(prod => {
                    lastPerc += prod.productPrice
                })
            })
        }
        
        const profit = (firstPerc * 0.1) + (secPerc * 0.05) + (lastPerc * 0.02)
        console.log(firstPerc, secPerc, lastPerc)
        res.status(200).json({
            message: "Successfully Gotten Profit",
            data: profit
        })       
   
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}