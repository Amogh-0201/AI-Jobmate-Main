const JobApplication = require('../models/job-application');
const {StatusCodes} =require('http-status-codes');

const saveJobApplicationData = async(req, res) => {
    const {userId} = req.user;
    const jobApplicationObject = {userId, ...req.body};
    const jobApplication = await JobApplication.create(jobApplicationObject);
    res.status(StatusCodes.CREATED).json({jobApplication});
}

const getAllJobApplications = async(req, res) => {
    const {userId} = req.user;
    const allJobApplications = await JobApplication.find({userId});
    res.status(StatusCodes.OK).json({allJobApplications});
}

module.exports = {
    saveJobApplicationData,
    getAllJobApplications
}