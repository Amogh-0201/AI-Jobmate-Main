require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    },
    confirmedPassword: {
        type: String,
        required: [true, 'Confirm password is required'],
        validate: {
            validator: function () {
                return this.password === this.confirmedPassword;
            },
            message: 'Passwords do not match'
        }
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    targetRole: {
        type: String
    },
    experienceLevel: {
        type: String
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date
    },
    resetPasswordVerified: {
        type: Boolean,
        default: false
    }
});

userSchema.pre("save", async function(){
    this.confirmedPassword = undefined;
    if (!this.isModified("password")) return;
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn: '3d'});
}

userSchema.methods.checkPassword = async function(givenPassword){
    return await bcryptjs.compare(givenPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);