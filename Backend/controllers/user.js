const User = require('../models/user');
const {StatusCodes} = require('http-status-codes');
const {UnAuthenticatedError} = require('../errors');

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

module.exports = {
    sendUserInfo,
    updateUserInfo
}