// routes/userCount.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Adjust based on your User model path

router.get('/totalpayment', async (req, res) => {
    try {
        const paymentCount = await Payment.countDocuments();
        res.json({ count: paymentCount });
    } catch (error) {
        console.error('Error fetching submission count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

