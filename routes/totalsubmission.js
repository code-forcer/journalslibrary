// routes/userCount.js
const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission'); // Adjust based on your User model path

router.get('/totalsubmission', async (req, res) => {
    try {
        const subCount = await Submission.countDocuments();
        res.json({ count: subCount });
    } catch (error) {
        console.error('Error fetching submission count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

module.exports = router;
