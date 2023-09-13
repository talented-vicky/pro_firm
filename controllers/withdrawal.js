const nodemailer = require('nodemailer');

const User = require('../models/user')

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
        // const user = await User.findById(req.userId)
        // const demo = await User.findById("65012f49674862d85782d14b")
        const user = User.findById("65012f49674862d85782d14b")
                .populate('purchasedProducts')
        if(!user){
            console.log("user not found")
            return
        }
        const result = await user
        console.log(`here ${result}`)
        res.status(200).json({data: result})
        
        // .populate({
        //     path: 'purchasedProduct',
        //     // select: 'productPrice'
        // })

        // console.log(demo)
        return

        const { referralCode } = user
        // check authentication

        // const child = await User.findOne({ parentRef: referralCode }).populate('productPrice')
        const child = await User.findOne({ referredBy: referralCode }).populate('purchasedProducts.productPrice')
        // console.log("I found first person logged in user referred")
        // console.log(child)
        return 
        const grandChild = await User.findOne({ grandRef: referralCode })
        const greatChild = await User.findOne({ greatRef: referralCode })

        let firstPerc = 0
        const ten = child.purchasedProducts.forEach(val => {
            firstPerc += val.productPrice
        })
        const five = grandChild.purchasedProducts.reduce((total, current) => {
            return secPerc + current.productPrice
        }, init)
        const two = greatChild.purchasedProducts.reduce(amount => {
            lastPerc += amount.productPrice
        })
   
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}