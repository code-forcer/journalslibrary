const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Submission = require('../models/Submission'); // Update the path based on your project structure

router.get('/issues', async (req, res)  => {
    try {
        // Fetch all submissions from the database
        const submissions = await Submission.find();
        res.render('pages/issues', {
            title: 'Issues',
            submissions, // Pass the fetched data to the EJS template
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        req.flash('error_msg', 'An error occurred while fetching data.');
        res.redirect('/issues'); // Redirect to the dashboard on error
    }
});

router.get('/issues/view/:id', async (req, res) => {
    try {
      const submission = await Submission.findById(req.params.id);
      if (!submission) {
        req.flash('error_msg', 'Submission not found.');
        return res.redirect('/issues');
      }
      res.render('pages/issues', { title: 'View Submission', submission });
    } catch (error) {
      console.error('Error viewing submission:', error);
      req.flash('error_msg', 'An error occurred while viewing the submission.');
      res.redirect('/issues');
    }
  });
   
module.exports = router;
