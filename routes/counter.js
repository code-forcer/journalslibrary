// routes/userCount.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust based on your User model path

router.get('/counter', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({ count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
