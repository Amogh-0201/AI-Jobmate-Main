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
    }
});

userSchema.pre("save", async function(){
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: '3d'});
}

userSchema.methods.checkPassword = async function(givenPassword){
    return await bcryptjs.compare(givenPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);