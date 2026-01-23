const mongoose = require('mongoose');
const User = require('./user');

const savedJobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, 'userId is required']
    },
    jobTitle: {
        type: String,
        required: [true, 'job title is required']
    },
    company: {
        type: String,
        required: [true, 'company name is required']
    },
    role: {
        type: String,
        required: [true, 'role is required']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SavedJobs', savedJobSchema);