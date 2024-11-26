const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Assuming a MongoDB User model
const router = express.Router();

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

// Registration Route
router.post(
    '/admin/auth',
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

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.render('pages/contactformsuccess', { 
                    title: 'user already exist',
                    successMessage: 'sorry , user already exist!.'
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

            // Redirect to the success page
        res.redirect('/contactformsuccess');
        } catch (error) {
            console.error('Error:', error);
            // Render error message
            res.render('pages/contactformsuccess', {
                title: 'JournalsLibrary | Get started',
                successMessage: 'Something went wrong. Please try again later.',
            });
        }
    });
    

// Render success page
router.get('/contactformsuccess', (req, res) => {
    res.render('pages/contactformsuccess', { 
        title: 'Message Sent Successfully',
        successMessage: 'Your profile created successfully!.'
    });
});

module.exports = router;
