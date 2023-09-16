const https = require('https')
const axios = require('axios')
const crypto = require('crypto')

const User = require('../models/user')

require('dotenv').config()
const paystack_secret_key = process.env.paystack_secret_key
const paystack_public_key =  process.env.paystack_public_key

exports.acceptPayment = async (req, res) => {
    try {
        const { email, amount } = req.body
        const params = JSON.stringify({ "email": email, "amount": amount * 100 })
        
        const options = {
            hostname: 'api.paystack.co',
            port: 5000,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: paystack_secret_key,
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            }
        }

        const request = https.request(options, apiReq => {
            let data = ''
            apiReq.on('data', chunk => {
                data += chunk
            })
            apiReq.on('end', () => {
                console.log(JSON.parse(data))
                return res.status(200).json(data)
            })
        }).on('error', err => {
            console.log(err)
            return res.status(400).json(err)
        })
        // ---> a response of this format below will be sent
        // {
        //     "status": true,
        //     "message": "Authorization URL created",
        //     "data": {
        //       "authorization_url": "https://checkout.paystack.com/0peioxfhpn",
        //       "access_code": "0peioxfhpn",
        //       "reference": "7PVGX8MEk85tgeEpVDtD"
        //     }
        // }
        request.write(params)
        request.end()    

    } catch (err) {
        console.log(err)
        res.status(500).json({error: `An error occured: ${err.message}`})
    }
    
}

exports.verifyPayment = async (req, res) => {
    const { reference } = req.query
    try {
        const options = {
            hostname: 'api.paystack.co',
            port: 5000,
            path: `/transaction/verify/${encodeURIComponent(reference)}`,
            method: 'GET',
            headers: { 
                Authorization: paystack_public_key,
                'content-type': 'application/json',
                'cache-control': 'no-cache' 
            }
        }

        const request = await axios(options)
        if(!request){
            const error = new Error("Error verifyinig payment")
            error.statusCode = 402
            throw error
        }

        // now updata referral count
        // check if this users referred by1 is

        const value = request.data
        return res.statsu(200).json(value)

    } catch (err) {
        console.log(err)
        res.status(500).json({error: `An error occured: ${err.message}`})
    }
}

exports.webhook = async (req, res) => {
    const encrypt = crypto.createHmac('sha512', secret)
        .update(JSON.stringify(req.body)).digest('hex')
    // Updating the Hmac content with the given data, since the encoding is 
    // given in inputEncoding. 
    // Note that If encoding is not provided, and data is a string
    // , an encoding of 'utf8' is enforced. If data is a 
    // Buffer, TypedArray, orDataView, then inputEncoding is ignored.
    // This can be called many times with new data as it is streamed.

    if(encrypt == req.header['x-paystack-signature']){
        const resolve = req.body
        if(resolve && resolve.event === 'transaction.success'){
            await res.status(200).json({message: 'Transfer Successful'})
        }
        else if(resolve && resolve.event === 'transaction.failed'){
            await res.status(400).json({message: 'Oops! Transaction Failed'})
        }
    }

    res.sendStatus(200)
}