const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission'); // Importing the Submission model

// GET route to render the paper status page
router.get('/checkpaperstatus', (req, res) => {
    res.render('pages/checkpaperstatus', {
        title: 'JournalsLibrary | Check for Paper Status',
        statusMessage: null // initially no status message
    });
});

// POST route to handle the paper status check
router.post('/checkpaperstatus', async (req, res) => {
    const { articleId } = req.body; // getting the article ID from the form inpu
    try {
        // Find the paper with the given submissionId in the database
        const paper = await Submission.findOne({ submissionId: articleId });

        if (paper) {
            // If the paper is found, send back JSON response with the status
            res.json({
                status: paper.status, // Return paper status in JSON
            });
        } else {
            // If no paper is found, send an error message in JSON
            res.json({
                error: '<h1 class="text-danger">No paper found with the provided article ID. Please try again.</h1>',
            });
        }
    } catch (err) {
        console.error('Error fetching paper status:', err); // Log the error for debugging
        res.status(500).json({
            error: 'There was an error checking the paper status. Please try again later.',
        });
    }
});

module.exports = router;

