const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Payment = require('../models/Payment'); // Update the path based on your project structure

router.get('/admin/allpayment', async (req, res)  => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view dashboard page.');
        return res.redirect('/admin/login');
    }

    try {
        // Fetch all submissions from the database
        const payments = await Payment.find();

        // Render the dashboard with the fetched data and the admin's name
        const userName = req.session.user.name;
        res.render('pages/admin/allpayment', {
            title: 'Admin alluser',
            userName,
            payments, // Pass the fetched data to the EJS template
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error_msg', 'An error occurred while fetching data.');
        res.redirect('/admin/dashboard'); // Redirect to the dashboard on error
    }
});

router.get('/admin/view/:id', async (req, res) => {
    try {
      const users = await User.findById(req.params.id);
      if (!users) {
        req.flash('error_msg', 'Users not found.');
        return res.redirect('/admin/allpayemnt');
      }
      res.render('pages/admin/view', { title: 'View Payment', payments });
    } catch (error) {
      console.error('Error viewing submission:', error);
      req.flash('error_msg', 'An error occurred while viewing the Payment.');
      res.redirect('/admin/allpaymeet');
    }
  });
  
  router.get('/admin/allpayment/delete/:id', async (req, res) => {
    try {
      await Payment.findByIdAndDelete(req.params.id);
      req.flash('success_msg', 'Payment deleted successfully.');
      res.redirect('/admin/allpayment');
    } catch (error) {
      console.error('Error deleting User:', error);
      req.flash('error_msg', 'An error occurred while deleting the users.');
      res.redirect('/admin/allpayment');
    }
  });
   
module.exports = router;
