const mongoose = require('mongoose');
const User = require('../models/user');

const skillGapSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, 'userId is required']
    },
    resumeText: {
        type:String,
        trim: true,
        required:[true, 'resume is required']
    },
    skillGaps: [
        {
            skill: {type: String, required:[true, 'skill is required']},
            priority: {type: String, required:[true, 'priority is required'], enum:['High','Medium','Low']},
            reason: {type: String, required:[true, 'reason is required']},
            suggestion: {type: String, required:[true, 'suggestion is required']}
        }
    ],
    overAllSuggestion: {
        type: String,
        required: [true, 'overAllSuggestion is required']
    }
});

module.exports = mongoose.model('SkillGaps', skillGapSchema);