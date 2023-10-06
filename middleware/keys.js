require('dotenv').config()

module.exports = {
    PORT : process.env.PORT || 5000,
    CONNECTION_URL : process.env.CONNECTION_URL,
    paystack_secret_key : process.env.paystack_secret_key,
    paystack_public_key :  process.env.paystack_public_key,
    live_secret_key : process.env.live_secret_key,
    live_public_key :  process.env.live_public_key
}