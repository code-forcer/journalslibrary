const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Contacts = require('../models/Contact'); // Update the path based on your project structure

router.get('/admin/allcontacts', async (req, res)  => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view dashboard page.');
        return res.redirect('/admin/login');
    }

    try {
        // Fetch all submissions from the database
        const contacts = await Contacts.find();

        // Render the dashboard with the fetched data and the admin's name
        const userName = req.session.user.name;
        res.render('pages/admin/allcontacts', {
            title: 'Admin Conatcts',
            userName,
            contacts, // Pass the fetched data to the EJS template
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error_msg', 'An error occurred while fetching data.');
        res.redirect('/admin/allcontacts'); // Redirect to the dashboard on error
    }
});

  router.get('/admin/allcontacts/delete/:id', async (req, res) => {
    try {
      await Contacts.findByIdAndDelete(req.params.id);
      req.flash('success_msg', 'User deleted successfully.');
      res.redirect('/admin/allcontacts');
    } catch (error) {
      console.error('Error deleting User:', error);
      req.flash('error_msg', 'An error occurred while deleting the users.');
      res.redirect('/admin/allcontacts');
    }
  });
   
module.exports = router;
