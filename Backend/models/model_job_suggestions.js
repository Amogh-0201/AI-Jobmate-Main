const mongoose = require('mongoose')
const User = require('../models/user')

const jobSuggestionsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, 'UserId is required']
    },
    jobs: [
        {
            job: {type: String, required:[true, 'job suggested is required']},
            confidence: {type:String, required:[true, 'confidence is required']}
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('JobSuggestions', jobSuggestionsSchema);