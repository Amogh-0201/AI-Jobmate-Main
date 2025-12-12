const path = require('path');
const User = require('../models/user');
const {StatusCodes} = require('http-status-codes');

const getLoginPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'login.html'));
}

const getRegisterPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'register.html'));
}

const register = async(req, res) => {
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({user});
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