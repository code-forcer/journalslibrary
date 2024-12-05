const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const fs = require('fs'); // Added fs for file system operations
const User = require('../models/User'); // Assuming a MongoDB User model
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Ensure Upload Directory Exists
const uploadPath = path.join(__dirname, '..', '/public/uploads', 'image');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Save uploaded files to the defined directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Allow only image files
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});

// About Page Route
router.get('/admin/auth', (req, res) => {
    res.render('pages/admin/auth', { title: 'JournalsLibrary | Create profile 📖' ,
        successMessage: null,
        errorMessage: null,
    });
    
});


// Transporter for email notifications
const transporter = nodemailer.createTransport({
    service: 'gmail',
            auth: {
                user: 'codeforcerdev@gmail.com',
                pass: 'razqvfdnonhepqkj', // Replace with app-specific password
            },
});
router.post(
    '/admin/auth',
    upload.single('profileImage'), // Add Multer middleware
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, role, password, about } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('pages/contactformsuccess', { 
                    title: 'User already exists',
                    successMessage: 'Sorry, user already exists!',
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user to the database
            const newUser = new User({
                name,
                email,
                phone,
                role,
                password: hashedPassword,
                about,
                profileImage, // Save the image filename
            });
            await newUser.save();

            // Send email to the user
            await transporter.sendMail({
                from: 'codeforcerdev@gmail.com',
                to: email,
                subject: 'Welcome to JournalsLibrary!',
                text: `Hi ${name},\n\nThank you for registering. We're excited to have you onboard!\n\nBest regards,\nJournalsLibrary Team`,
            });

            // Notify admin about the new registration
            await transporter.sendMail({
                from: 'codeforcerdev@gmail.com',
                to: 'codeforcerdev@gmail.com',
                subject: 'New User Registration',
                text: `A new user has registered:\n\nName: ${name}\nEmail: ${email}\nRole: ${role}`,
            });

            res.redirect('/contactformsuccess');
        } catch (error) {
            console.error('Error:', error);
            res.render('pages/contactformsuccess', {
                title: 'Error',
                successMessage: 'Something went wrong. Please try again later.',
            });
        }
    }
);


// Render success page
router.get('/contactformsuccess', (req, res) => {
    res.render('pages/contactformsuccess', { 
        title: 'Message Sent Successfully',
        successMessage: 'Your profile created successfully!.'
    });
});

module.exports = router;
