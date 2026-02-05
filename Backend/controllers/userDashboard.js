const Activities = require('../models/activities');

const getRecentActivities = async(req, res) => {
    const {userId} = req.user;
    const recentActivities = await Activities.find({userId: userId}).sort({createdAt:-1}).limit(3);
    res.status(200).json({successs: true, recentActivities});
}

module.exports = {
    getRecentActivities
}