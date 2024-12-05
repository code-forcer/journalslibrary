const express = require('express');
const multer = require('multer');
const User = require('../models/User'); // Your MongoDB model
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const path = require('path');
const router = express.Router();

// GET route to view a specific submission
router.get('/admin/vieweachuser/:userId', async (req, res) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Please log in to view dashboard page.');
    return res.redirect('/admin/login');
}
  try {
     // Render the dashboard with the fetched data and the admin's name

      const userId = req.params.userId;

      // Find the submission from the database by the ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');
      }
      const userName = req.session.user.name;
      // Render the page with the submission details
      res.render('pages/admin/vieweachuser', {
          title: 'View Submission',
          userName,
          user, // Pass the submission details to the view
      });
  } catch (error) {
      console.error('Error fetching User:', error);
      res.status(500).send('Server Error');
  }
});


router.get('/admin/vieweachuser/delete/:id', async (req, res) => {
    try {
      await Submission.findByIdAndDelete(req.params.id);
      req.flash('success_msg', 'Submission deleted successfully.');
      res.redirect('/admin/alluser');
    } catch (error) {
      console.error('Error deleting submission:', error);
      req.flash('error_msg', 'An error occurred while deleting the submission.');
      res.redirect('/admin/alluser');
    }
  });
   
module.exports = router;
