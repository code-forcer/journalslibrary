const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Submission = require('../models/Submission'); // Update the path based on your project structure

router.get('/admin/alluploaded', async (req, res)  => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view dashboard page.');
        return res.redirect('/admin/login');
    }

    try {
        // Fetch all submissions from the database
        const submissions = await Submission.find();

        // Render the dashboard with the fetched data and the admin's name
        const userName = req.session.user.name;
        res.render('pages/admin/alluploaded', {
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
router.get('/admin/view/:id', async (req, res) => {
    try {
      const submission = await Submission.findById(req.params.id);
      if (!submission) {
        req.flash('error_msg', 'Submission not found.');
        return res.redirect('/admin/alluploaded');
      }
      res.render('pages/admin/view', { title: 'View Submission', submission });
    } catch (error) {
      console.error('Error viewing submission:', error);
      req.flash('error_msg', 'An error occurred while viewing the submission.');
      res.redirect('/admin/alluploaded');
    }
  });
  
  router.get('/admin/alluploaded/delete/:id', async (req, res) => {
    try {
      await Submission.findByIdAndDelete(req.params.id);
      req.flash('success_msg', 'Submission deleted successfully.');
      res.redirect('/admin/alluploaded');
    } catch (error) {
      console.error('Error deleting submission:', error);
      req.flash('error_msg', 'An error occurred while deleting the submission.');
      res.redirect('/admin/alluploaded');
    }
  });
   
module.exports = router;
