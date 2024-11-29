const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission'); // Update the path based on your project structure

router.get('/admin/dashboard', async (req, res)  => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view dashboard page.');
        return res.redirect('/admin/login');
    }

    try {
        // Fetch all submissions from the database
        const submissions = await Submission.find();

        // Render the dashboard with the fetched data and the admin's name
        const userName = req.session.user.name;
        res.render('pages/admin/dashboard', {
            title: 'Admin Dashboard',
            userName,
            submissions, // Pass the fetched data to the EJS template
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        req.flash('error_msg', 'An error occurred while fetching data.');
        res.redirect('/admin/dashboard'); // Redirect to the dashboard on error
    }
});

module.exports = router;
