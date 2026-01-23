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

//delete a saved job
const deleteSavedJob = async(req, res) => {
    const {userId} = req.user;
    const {savedJobId} = req.body;
    await SavedJob.findOneAndDelete({userId: userId, _id: savedJobId});
    res.status(StatusCodes.OK).json({"msg": "data deleted successfully"});
}

//get a savedJob
const getSavedJob = async(req, res) => {
    const {userId} = req.user;
    const {savedJobId} = req.params;
    const savedJob = await SavedJob.findOne({userId: userId, _id: savedJobId});
    res.status(200).json({savedJob});
}

module.exports = {
    getAllSavedJobs,
    saveSavedJob,
    deleteSavedJob,
    getSavedJob
}