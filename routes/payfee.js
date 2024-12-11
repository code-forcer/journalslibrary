//This is /payfee
const express = require('express');
const axios = require('axios'); // Use axios for HTTP requests to PayPal
const router = express.Router();
const Payment = require('../models/Payment'); // Import the Payment model

router.get('/payfee', (req, res) => {
    res.render('pages/payfee', { title: 'JournalsLibrary | Pay Fee' });
});

const PAYPAL_CLIENT_ID = 'AW6S_R9zDD2pqtsAAa0582e2vGdM-dwD1CrAhbQNw_7rFOtXeY-ZYOtR3C4V4ciHSwYJnoZ0v2juVm80'; // Use environment variables
const PAYPAL_SECRET = 'EHOyylQImLoyvkYNLCoBFKgRsOquDuEYH3noHxq7Mi-8piCk58IbZ-bWuUGSNC00Ew0Hyf0CpNugjYP4';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Sandbox URL for testing
router.post('/payfee', async (req, res) => {
  try {
    const { amount, title, payerName, payerEmail, paperid } = req.body;
    const currency = 'USD'; // Set default currency here if not provided

    // Validate required fields
    if (!amount || !currency || !title || !payerName || !payerEmail || !paperid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save initial payment data in the database
    const payment = new Payment({
      payerName,
      payerEmail,
      amount,
      currency,
      title,
      paperid,
      paymentStatus: 'Pending',
    });
    await payment.save();

    // Get an access token from PayPal
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const { data: authResponse } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    // Create a payment order
    const { data: orderResponse } = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
            description: title,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${authResponse.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update database with transaction ID
    payment.transactionId = orderResponse.id;
    await payment.save();

    // Send the approval link to the client
    const approvalLink = orderResponse.links.find((link) => link.rel === 'approve').href;
    res.redirect(approvalLink);
  } catch (error) {
    console.error('Error creating PayPal order:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

module.exports = router;
