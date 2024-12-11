const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    submissionId: { type: String, required: true, unique: true },
    authorName: { type: String, required: true },
    paperTitle: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    paperFile: { type: String, required: true },
    status: { 
        type: String, 
        required: true, 
        default: 'Under Review', // Default status when paper is submitted
        enum: ['Under Review', 'Accepted', 'Rejected'] // Enum of possible statuses
    }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
