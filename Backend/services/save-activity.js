const Activities = require('../models/activities');

async function saveActivity({
    userId,
    userActivityId,
    type,
    activity,
    createdAt
}) {
    await Activities.create({
        userId,
        userActivityId,
        type,
        activity,
        createdAt
    });
    const historyCount = await Activities.countDocuments({userId});
    if(historyCount > 10) {
        const oldest = await Activities.findOne({userId}).sort({createdAt:1});
        if(oldest) {
            await Activities.findOneAndDelete({userId: userId, _id: oldest._id});
        }
    }
}

module.exports = {saveActivity};