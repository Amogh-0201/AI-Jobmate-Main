const User = require('../models/user');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnAuthenticatedError} = require('../errors');

const register = async(req, res) => {
    const user = await User.create(req.body);
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
    changePassword
}