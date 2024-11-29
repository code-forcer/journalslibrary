const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login Page
router.get('/admin/login', (req, res) => {
    res.render('pages/admin/login', { title: 'User Login' });
});

// Handle Login
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid email or password');
            return res.redirect('/admin/login');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid email or password');
            return res.redirect('/admin/login');
        }

        // Store admin's name and other details in the session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        // Redirect to the dashboard
        req.flash('success_msg', 'Welcome back!');
        return res.redirect('/admin/dashboard'); // Ensure only one response is sent
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Something went wrong. Please try again.');
        return res.redirect('/admin/login');
    }
});

module.exports = router;
