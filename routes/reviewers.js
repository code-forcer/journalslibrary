const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User= require('../models/User'); // Update the path based on your project structure

router.get('/reviewers', async (req, res)  => {
    try {
        // Fetch all submissions from the database
        const users = await User.find();
        res.render('pages/reviewers', {
            title: 'Reviewers',
            users, // Pass the fetched data to the EJS template
        });
    } catch (error) {
        console.error('Error fetching reviewers:', error);
        req.flash('error_msg', 'An error occurred while fetching data.');
        res.redirect('/reviewers'); // Redirect to the dashboard on error
    }
});
module.exports = router;
