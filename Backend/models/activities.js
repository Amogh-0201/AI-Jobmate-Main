const mongoose = require('mongoose');
const User = require('./user');

const activitiesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, 'userId is required']
    },
    userActivityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'userActivityId is required']
    },
    type: {
        type: String,
        enum: ['JOB_APPLIED','JOB_SAVED','RESUME_ANALYZED','REMOVED'],
        required: [true, 'type is required']
    },
    activity: {
        type: String,
        required: [true, 'activity is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activities', activitiesSchema);