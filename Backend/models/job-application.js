const mongoose = require('mongoose');
const User = require('./user');

const jobApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, 'userId is required']
    },
    jobTitle: {
        type: String,
        required: [true, 'Job Title is required']
    },
    company: {
        type: String,
        required: [true, 'company name is required']
    },
    status: {
        type: String,
        required: [true, 'status value is required'],
        enum:['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);