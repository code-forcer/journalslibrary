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

        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com', // Hostinger's SMTP server
            port: 465,                  // Use port 465 for secure connections
            secure: true,               // Use true for SSL/TLS
            auth: {
                user: 'editor@journalslibrary.net', // Your email address
                pass: 'K~/WgIKMF7^k',              // Your email password
            },
        });
        // Send email to the user
        await transporter.sendMail({
            from: 'editor@journalslibrary.net',
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
            from: 'editor@journalslibrary.net',
            to: 'editor@journalslibrary.net',
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
