//This is /capture payemnt
const express = require('express');
const axios = require('axios'); // Use axios for HTTP requests to PayPal
const router = express.Router();
const Payment = require('../models/Payment'); // Import the Payment model

const PAYPAL_CLIENT_ID = 'AW6S_R9zDD2pqtsAAa0582e2vGdM-dwD1CrAhbQNw_7rFOtXeY-ZYOtR3C4V4ciHSwYJnoZ0v2juVm80'; // Use environment variables
const PAYPAL_SECRET = 'EHOyylQImLoyvkYNLCoBFKgRsOquDuEYH3noHxq7Mi-8piCk58IbZ-bWuUGSNC00Ew0Hyf0CpNugjYP4';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Sandbox URL for testing

router.get('/capture-payment', async (req, res) => {
    try {
      const { token } = req.query; // 'token' is the order ID returned by PayPal
  
      // Get an access token
      const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
      const { data: authResponse } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
  
      // Capture the payment
      const { data: captureResponse } = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authResponse.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Update payment status in the database
      const payment = await Payment.findOne({ transactionId: token });
      if (payment) {
        payment.paymentStatus = 'Completed';
        await payment.save();
      }
  
      res.json({ message: 'Payment captured successfully' });
    } catch (error) {
      console.error('Error capturing payment:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to capture payment' });
    }
  });
  
  
module.exports = router;
