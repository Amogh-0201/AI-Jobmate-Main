const User = require('../models/user');

const getUserInfo = async(req, res) => {
    const {userId} = req.user;
    const user = await User.findOne({_id: userId});
    res.status(200).json({user});
}

module.exports = {
    getUserInfo
}