const SavedJob = require('../models/saved-job');
const {StatusCodes} = require('http-status-codes');

//get all saved jobs by a user
const getAllSavedJobs = async(req, res) => {
    const {userId} = req.user;
    const savedJobs = await SavedJob.find({userId: userId});
    res.status(StatusCodes.OK).json({savedJobs});
}

//save a job in savedjob section
const saveSavedJob = async(req, res) => {
    const {userId} = req.user;
    const savedJobObject = {userId, ...req.body};
    const savedJob = await SavedJob.create(savedJobObject);
    res.status(StatusCodes.CREATED).json({savedJob});
}

module.exports = {
    getAllSavedJobs,
    saveSavedJob
}