const express = require('express');
const router = express.Router();

router.get('/admin/logout', (req, res) => {
    // Set flash message before destroying the session
    req.flash('success_msg', 'You have successfully logged out.');

    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            req.flash('error_msg', 'Logout failed. Please try again.');
            return res.redirect('/admin/dashboard');
        }

        // Clear the cookie
        res.clearCookie('connect.sid');
        res.redirect('/admin/login'); // Redirect after destroying session
    });
});

module.exports = router;
