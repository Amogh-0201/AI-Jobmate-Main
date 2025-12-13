const path = require('path');
const User = require('../models/user');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnAuthenticatedError} = require('../errors');

const getLoginPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'login.html'));
}

const getRegisterPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'register.html'));
}

const register = async(req, res) => {
    if(req.body.password !== req.body.confirmedPassword){
        throw new BadRequestError('Different password entered');
    }
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

module.exports = {
    getLoginPage,
    getRegisterPage,
    register,
    login
}