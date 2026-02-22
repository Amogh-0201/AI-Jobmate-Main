const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const otpSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, 'please provide email id'],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email, please provide a valid email',
        },
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
    otp: {
        type: String,
        required: [true, 'otp is required']
    },
    expiresAt: {
        type: Date,
        default:() => new Date(Date.now() + 1000 * 60 * 5),
        index: {expires: 0}
    }
});

otpSchema.pre('save', async function() {
    this.confirmedPassword = undefined;
    const salt = await bcryptjs.genSalt(10);
    this.otp = await bcryptjs.hash(this.otp, salt);
    this.password = await bcryptjs.hash(this.password, salt);
});

otpSchema.methods.checkOtp = async function(givenOtp) {
    return await bcryptjs.compare(givenOtp, this.otp);
}

module.exports = mongoose.model('UserOtp', otpSchema);