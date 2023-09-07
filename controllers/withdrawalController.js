const nodemailer = require('nodemailer');

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