const JobApplication = require('../models/job-application');
const {StatusCodes} =require('http-status-codes');

//save new job application post method handling
const saveJobApplicationData = async(req, res) => {
    const {userId} = req.user;
    const jobApplicationObject = {userId, ...req.body};
    const jobApplication = await JobApplication.create(jobApplicationObject);
    res.status(StatusCodes.CREATED).json({jobApplication});
}

//get all jobs linked with the logged in user
const getAllJobApplications = async(req, res) => {
    const {userId} = req.user;
    const allJobApplications = await JobApplication.find({userId});
    res.status(StatusCodes.OK).json({allJobApplications});
}

//remove a particular job
const removeJobApplication = async(req, res) => {
    const {userId} = req.user;
    const {jobApplicationId} = req.body;
    await JobApplication.findOneAndDelete({_id: jobApplicationId, userId: userId});
    res.status(StatusCodes.OK).json({msg: "data deleted successfully"});
}

//get a job info for editing
const getJobApplication = async(req, res) => {
    const {userId} = req.user;
    const {jobApplicationId} = req.params;
    const jobApplication = await JobApplication.findOne({_id:jobApplicationId, userId:userId});
    res.status(StatusCodes.OK).json({jobApplication});
}

//update the job after editing
const updateJobApplication = async(req, res) => {
    const {userId} = req.user;
    const {jobApplicationId} = req.body;
    const {jobTitle, company, status, date, note} = req.body;
    await JobApplication.findOneAndUpdate({_id:jobApplicationId, userId: userId}, {
        jobTitle,
        company,
        status,
        date,
        note
    });
    res.status(StatusCodes.OK).json({msg: "job application updated successfully"});
}

//update only note for a particular job application
const updateNote = async (req, res) => {
    const {userId} = req.user;
    const {note} = req.body;
    
    const job = await JobApplication.findOneAndUpdate(
        { _id: req.params.jobApplicationId, userId: userId },
        { note },
        { new: true }
    );

    res.status(200).json({ job });
}

module.exports = {
    saveJobApplicationData,
    getAllJobApplications,
    removeJobApplication,
    updateJobApplication,
    getJobApplication,
    updateNote
}