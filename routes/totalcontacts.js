// routes/userCount.js
const express = require('express');
const router = express.Router();
const Contacts = require('../models/Contact'); // Adjust based on your User model path

router.get('/totalcontacts', async (req, res) => {
    try {
        const contactCount = await Contacts.countDocuments();
        res.json({ count: contactCount });
    } catch (error) {
        console.error('Error fetching submission count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

