const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 30
    },
    email:{
        type: String,
        required: [true, 'please provide email id'],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email, please provide a valid email',
        },
        unique: true,
        isLowercase:true,
        trim:true
    },
    password:{
        type: String,
        required:[true, 'please enter password'],
        minlength: 6,
    }
});

module.exports = mongoose.model('User', userSchema);