const User = require('../models/user');
const {UnAuthenticatedError} = require('../errors');

const sendUserInfo = async(req, res) => {
    const {userId} = req.user;
    const user = await User.findOne({_id: userId});
    if(!user){
        throw new UnAuthenticatedError('user not found please login and try again');
    }
    res.status(200).json({user});
}

module.exports = {
    sendUserInfo
}