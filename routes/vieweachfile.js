const express = require('express');
const multer = require('multer');
const Submission = require('../models/Submission'); // Your MongoDB model
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const path = require('path');
const router = express.Router();

// GET route to view a specific submission
router.get('/admin/vieweachfile/:submissionId', async (req, res) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Please log in to view dashboard page.');
    return res.redirect('/admin/login');
}
  try {
     // Render the dashboard with the fetched data and the admin's name

      const submissionId = req.params.submissionId;

      // Find the submission from the database by the ID
      const submission = await Submission.findById(submissionId);

      if (!submission) {
          return res.status(404).send('Submission not found');
      }
      const userName = req.session.user.name;
      // Render the page with the submission details
      res.render('pages/admin/vieweachfile', {
          title: 'View Submission',
          userName,
          submission, // Pass the submission details to the view
      });
  } catch (error) {
      console.error('Error fetching submission:', error);
      res.status(500).send('Server Error');
  }
});
// Configure Multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/uploads')); // Save in 'public/uploads'
  },
  filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName); // Save with a unique name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
      const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Invalid file type. Only PDFs and DOC/DOCX are allowed.'));
      }
      cb(null, true);
  },
});

router.post('/admin/vieweachfile/update/:id', upload.single('paperFile'), async (req, res) => {
  try {
      const { authorName, paperTitle, email, country, status } = req.body;
      const paperFile = req.file ? `/uploads/${req.file.filename}` : req.body.existingFilePath; // Keep existing file if no new file is uploaded

      // Find and update the submission
      const updatedSubmission = await Submission.findByIdAndUpdate(
          req.params.id,
          {
              authorName,
              paperTitle,
              email,
              country,
              status,
              paperFile, // Update the file path if a new file is uploaded
          },
          { new: true } // Return the updated document
      );

      res.redirect(`/admin/vieweachfile/${updatedSubmission._id}`); // Redirect to the updated submission view page
  } catch (error) {
      console.error('Error updating submission:', error);
      res.status(500).send('Server Error');
  }
});

   
module.exports = router;
