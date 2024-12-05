const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/User'); // Update the path based on your project structure

router.get('/admin/alluser', async (req, res)  => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view dashboard page.');
        return res.redirect('/admin/login');
    }

    try {
        // Fetch all submissions from the database
        const users = await User.find();

        // Render the dashboard with the fetched data and the admin's name
        const userName = req.session.user.name;
        res.render('pages/admin/alluser', {
            title: 'Admin alluser',
            userName,
            users, // Pass the fetched data to the EJS template
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error_msg', 'An error occurred while fetching data.');
        res.redirect('/admin/alluser'); // Redirect to the dashboard on error
    }
});

router.get('/admin/view/:id', async (req, res) => {
    try {
      const users = await User.findById(req.params.id);
      if (!users) {
        req.flash('error_msg', 'Users not found.');
        return res.redirect('/admin/alluser');
      }
      res.render('pages/admin/view', { title: 'View Submission', users });
    } catch (error) {
      console.error('Error viewing submission:', error);
      req.flash('error_msg', 'An error occurred while viewing the users.');
      res.redirect('/admin/alluser');
    }
  });
  
  router.get('/admin/alluser/delete/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      req.flash('success_msg', 'User deleted successfully.');
      res.redirect('/admin/alluser');
    } catch (error) {
      console.error('Error deleting User:', error);
      req.flash('error_msg', 'An error occurred while deleting the users.');
      res.redirect('/admin/alluser');
    }
  });
   
module.exports = router;
