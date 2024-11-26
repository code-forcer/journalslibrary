const express = require('express');
const multer = require('multer');
const Submission = require('../models/Submission'); // Assuming you created this model
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const router = express.Router();

// Configure Multer for in-memory storage
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only PDFs and DOC/DOCX are allowed.'));
        }
        cb(null, true);
    },
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'codeforcerdev@gmail.com',
        pass: 'razqvfdnonhepqkj',
    },
});

// GET: Render the submit manuscripts page
router.get('/submitmanuscripts', (req, res) => {
    res.render('pages/submitmanuscripts', {
        title: 'JournalsLibrary | Submit Manuscripts',
    });
});

// POST: Handle manuscript submission
router.post('/submitmanuscripts', upload.single('paper_file'), async (req, res) => {
    try {
        const { author_name, paper_title, email, country } = req.body;

        if (!author_name || !paper_title || !email || !country || !req.file) {
            return res.status(400).send('Missing required fields or file.');
        }

        // Generate a unique submission ID
        const uniqueId = `JL_${uuidv4().split('-')[0]}`;

        // Convert file buffer to Base64 string
        const base64File = req.file.buffer.toString('base64');

        // Save submission to the database
        const newSubmission = new Submission({
            authorName: author_name,
            paperTitle: paper_title,
            email,
            country,
            paperFile: base64File, // Save as Base64
            submissionId: uniqueId,
        });

        await newSubmission.save();

        // Send confirmation email to the user
        const userMailOptions = {
            from: 'codeforcerdev@gmail.com',
            to: email,
            subject: 'Your Manuscript Submission is Successful',
            html: `
                <p>Dear ${author_name},</p>
                <p>Your manuscript titled "<strong>${paper_title}</strong>" has been successfully submitted.</p>
                <p>Your submission ID is <strong>${uniqueId}</strong>.</p>
                <p>Thank you for using our platform!</p>
            `,
        };

        // Send an email to the admin to notify about the new submission
        const adminMailOptions = {
            from: 'codeforcerdev@gmail.com',
            to: 'codeforcerdev@gmail.com',
            subject: 'New Manuscript Submission',
            html: `
                <p><strong>Author Name:</strong> ${author_name}</p>
                <p><strong>Paper Title:</strong> ${paper_title}</p>
                <p><strong>Author Email:</strong> ${email}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Submission ID:</strong> ${uniqueId}</p>
            `,
        };

        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.render('pages/submissionSuccess', {
            title: 'Submission Successful',
            submissionId: uniqueId,
        });
    } catch (error) {
        console.error('Error during manuscript submission:', error);
        res.status(500).send('Server Error');
    }
});

// Error handling middleware for Multer file upload errors
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).send(`File upload error: ${err.message}`);
    } else if (err) {
        return res.status(500).send('Server error');
    }
    next();
});

module.exports = router;
