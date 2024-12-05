const express = require('express');
const multer = require('multer');
const Submission = require('../models/Submission'); // Your MongoDB model
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const path = require('path');
const router = express.Router();

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

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Hostinger's SMTP server
    port: 465,                  // Use port 465 for secure connections
    secure: true,               // Use true for SSL/TLS
    auth: {
        user: 'editor@journalslibrary.net', // Your email address
        pass: 'K~/WgIKMF7^k',              // Your email password
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

        // Validate required fields
        if (!author_name || !paper_title || !email || !country || !req.file) {
            return res.status(400).send('Missing required fields or file.');
        }

        // Generate a unique submission ID
        const uniqueId = `JL_${uuidv4().split('-')[0]}`;

        // Save submission to the database
        const newSubmission = new Submission({
            authorName: author_name,
            paperTitle: paper_title,
            email,
            country,
            paperFile: `/uploads/${req.file.filename}`, // Save the file path
            submissionId: uniqueId,
        });

        await newSubmission.save();

        // Send confirmation email to the user
        const userMailOptions = {
            from: 'editor@journalslibrary.net',
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
            from: 'editor@journalslibrary.net',
            to: 'editor@journalslibrary.net',
            subject: 'New Manuscript Submission',
            html: `
                <p><strong>Author Name:</strong> ${author_name}</p>
                <p><strong>Paper Title:</strong> ${paper_title}</p>
                <p><strong>Author Email:</strong> ${email}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Submission ID:</strong> ${uniqueId}</p>
                <p><strong>File Path:</strong> /uploads/${req.file.filename}</p>
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
