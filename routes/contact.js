const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact'); // Import the Contact model

// Render contact form
router.get('/contact', (req, res) => {
    res.render('pages/contact', { 
        title: 'JournalsLibrary | Contact Us',
        successMessage: null,
        errorMessage: null,
    });
});

// Handle form submission
router.post('/contact', async (req, res) => {
    const { name, email, subject, message, emergency } = req.body;

    try {
        // Save the contact data in the database
        const contact = new Contact({
            name,
            email,
            subject,
            message,
            emergency: emergency === 'on',
        });
        await contact.save();

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'codeforcerdev@gmail.com',
                pass: 'razqvfdnonhepqkj', // Replace with app-specific password
            },
        });

        // Send email to the user
        await transporter.sendMail({
            from: 'codeforcerdev@gmail.com',
            to: email,
            subject: `We received your submission - ${subject}`,
            html: `
                <p>Hi ${name},</p>
                <p>Thank you for reaching out. We received the following message:</p>
                <blockquote>${message}</blockquote>
                ${emergency ? '<p><strong>Note:</strong> This was marked as an emergency.</p>' : ''}
                <p>We will get back to you shortly.</p>
            `,
        });

        // Send email to the admin
        await transporter.sendMail({
            from: 'codeforcerdev@gmail.com',
            to: 'codeforcerdev@gmail.com',
            subject: `New Contact Form Submission - ${subject}`,
            html: `
                <p>New message from:</p>
                <ul>
                    <li>Name: ${name}</li>
                    <li>Email: ${email}</li>
                    <li>Subject: ${subject}</li>
                    <li>Emergency: ${emergency ? 'Yes' : 'No'}</li>
                </ul>
                <p>Message:</p>
                <blockquote>${message}</blockquote>
            `,
        });

        // Redirect to the success page
        res.redirect('/contactformsuccess');
    } catch (error) {
        console.error('Error:', error);
        // Render error message
        res.render('pages/contact', {
            title: 'JournalsLibrary | Contact Us',
            successMessage: null,
            errorMessage: 'Something went wrong. Please try again later.',
        });
    }
});

// Render success page
router.get('/contactformsuccess', (req, res) => {
    res.render('pages/contactformsuccess', { 
        title: 'Message Sent Successfully',
        successMessage: 'Your message has been sent successfully! We will get back to you shortly.'
    });
});

module.exports = router;
