const User = require('../models/user');
const crypto = require('crypto');
const sendEmail = require('../services/sendEmail');
const {StatusCodes} = require('http-status-codes');
const {UnAuthenticatedError, BadRequestError} = require('../errors');
const bcryptjs = require('bcryptjs');

const sendUserInfo = async(req, res) => {
    const {userId} = req.user;
    const user = await User.findOne({_id: userId});
    if(!user){
        throw new UnAuthenticatedError('user not found please login and try again');
    }
    res.status(200).json({user});
}

const updateUserInfo = async(req, res) => {
    const {userId} = req.user;
    const {targetRole, experienceLevel} = req.body;
    let updatedFields = {};
    if(targetRole) {
        updatedFields.targetRole = targetRole;
    }
    if(experienceLevel) {
        updatedFields.experienceLevel = experienceLevel;
    }
    const updatedUser = await User.findByIdAndUpdate({_id: userId}, {$set: updatedFields}, {new: true});
    res.status(200).json({updatedUser});
}

const updateTheme = async(req, res) => {
    const {userId} = req.user;
    const {theme} = req.body;
    await User.findOneAndUpdate({_id: userId}, {
        $set: {theme}
    });
    res.status(200).json({msg: 'Theme updated'});
}

const sendOtpForDelete = async(req, res) => {
        const otp = crypto.randomInt(100000, 999999).toString();
        const {userId} = req.user;

        const hashedOtp = await bcryptjs.hash(otp, 10);

        const user = await User.findOne({_id: userId});
        if(!user) {
            throw new UnAuthenticatedError('User not found!!');
        }
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 5*60*1000;
        await user.save({validateBeforeSave: false});

        const options = {email: user.email, otp};
        await sendEmail(options);
        res.status(201).json({msg: `OTP sent successfully`});
}

const deleteUser = async(req, res) => {
    const {userId} = req.user;
    const {otp} = req.body;
    const user = await User.findOne({_id: userId});
    if (!user) {
        throw new UnAuthenticatedError("User not found");
    }
    if (!user.otp || !user.otpExpires) {
        throw new BadRequestError("No OTP request found");
    }
    if(Date.now() > user.otpExpires) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({validateBeforeSave: false});
        throw new BadRequestError('OTP expired!!');
    }
    const isCorrectOtp = await bcryptjs.compare(otp, user.otp);
    if(!isCorrectOtp) {
        throw new BadRequestError('OTP is invalid!!');
    }
    await User.findOneAndDelete({_id: userId});
    res.status(200).json({success: true, msg: 'account deleted successfully'});
}

module.exports = {
    sendUserInfo,
    updateUserInfo,
    updateTheme,
    sendOtpForDelete,
    deleteUser
}