const path = require('path');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../errors');

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
    res.send('login user');
}

module.exports = {
    getLoginPage,
    getRegisterPage,
    register,
    login
}