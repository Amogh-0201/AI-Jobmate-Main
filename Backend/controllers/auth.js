const User = require('../models/user');
const UserOtp = require('../models/userOtp');
const crypto = require('crypto');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnAuthenticatedError} = require('../errors');
const sendEmail = require('../services/sendEmail');

const sendOtp = async(req, res) => {
    try{
        const otp = crypto.randomInt(100000, 999999).toString();
        const {email} = req.body;
        const options = {email, otp};
        await UserOtp.create({...req.body, otp});
        await sendEmail(options);
        res.status(201).json({success: true, msg: 'mail sent successfully'});
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

const register = async(req, res) => {
    const {otp, ...userData} = req.body;
    const {name, email} = userData;

    const otpUser = await UserOtp.findOne({name, email}).sort({expiresAt: -1});
    if(!otpUser) {
        throw new BadRequestError('OTP expired!!');
    }
    if (otpUser.expiresAt < Date.now()) {
        throw new BadRequestError("OTP expired");
    }
    const rightOtpEntered = await otpUser.checkOtp(otp);
    if(!rightOtpEntered) {
        throw new BadRequestError('invalid OTP entered!!');
    }
    await UserOtp.deleteMany({email});

    const user = await User.create(userData);
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user, token});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please enter email and password');
    }

    const user = await User.findOne({email: email});
    if(!user){
        throw new UnAuthenticatedError('Invalid Credentials');
    }
    const correctPasswordEntered = await user.checkPassword(password);
    if(!correctPasswordEntered){
        throw new UnAuthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({token});
}

const verifyPassword = async(req, res) => {
    const {userId} = req.user;
    const {password} = req.body;
    const user = await User.findOne({_id: userId});
    const correctPasswordEntered = await user.checkPassword(password);
    if(!correctPasswordEntered) {
        throw new UnAuthenticatedError('Invalid Credentials');
    }
    res.status(201).json({msg: "Password Verification Successful"});
}

const changePassword = async(req, res) => {
    const {userId} = req.user;
    const {newPassword, confirmPassword} = req.body;
    const user = await User.findOne({_id: userId});
    if(newPassword !== confirmPassword) {
        throw new BadRequestError('Different passwords are entered');
    }
    user.password = newPassword;
    user.confirmedPassword = confirmPassword;
    await user.save();
    res.status(200).json({msg: "password changed successfully"});
}

module.exports = {
    register,
    login,
    verifyPassword,
    changePassword,
    sendOtp
}