const {saveActivity} = require('../services/save-activity');
const Activities = require('../models/activities');
const JobApplication = require('../models/job-application');
const {StatusCodes} =require('http-status-codes');

//save new job application post method handling
const saveJobApplicationData = async(req, res) => {
    const {userId} = req.user;
    const jobApplicationObject = {userId, ...req.body};
    const jobApplication = await JobApplication.create(jobApplicationObject);
    //saving to activity section
    const activityObject = {
        userId: userId,
        userActivityId: jobApplication._id,
        type: 'JOB_APPLIED',
        activity: `Applied to ${req.body.jobTitle} at ${req.body.company}`
    }
    if(req.body.date) {
        activityObject.createdAt = date;
    }
    await saveActivity(activityObject);

    res.status(StatusCodes.CREATED).json({jobApplication});
}

//get all jobs linked with the logged in user + applying filters
const getAllJobApplications = async(req, res) => {
    const {userId} = req.user;
    const {search_query, status, sort, date} = req.query;

    let queryObject = {userId: userId};

    //for status
    if (status && status !== 'all') {
        queryObject.status = status;
    }
    //for date
    if (date) {
        const now = new Date();
        let startDate;
        if (date === 'today') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
        }
        if (date === '7days') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        }
        if (date === '30days') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
        }
        if (startDate) {
            queryObject.date = { $gte: startDate };
        }
    }

    //for sort
    let sortObject = { date: -1 };
    if (sort === 'oldest') {
        sortObject = { date: 1 };
    }

    if(search_query){
        queryObject.$or = [
            { jobTitle: {$regex: search_query, $options: 'i' } },
            { company: {$regex: search_query, $options: 'i' } }
        ];
    }

    const jobApplications = await JobApplication.find(queryObject).sort(sortObject);
    res.status(200).json({success: true, jobApplications});
}

//remove a particular job
const removeJobApplication = async(req, res) => {
    const {userId} = req.user;
    const {jobApplicationId} = req.body;
    const jobApplication = await JobApplication.findOne({_id: jobApplicationId, userId: userId});
    await JobApplication.findOneAndDelete({_id: jobApplicationId, userId: userId});
    await saveActivity({
        userId,
        userActivityId: jobApplicationId,
        type: 'JOB_APPLIED',
        activity: `Removed job application of ${jobApplication.jobTitle} at ${jobApplication.company}`
    })
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
    const { userId } = req.user;
    const { jobApplicationId, jobTitle, company, status, note, date } = req.body;

    const updateFields = {
        jobTitle,
        company,
        status,
        note
    };

    if (date) {
        updateFields.date = new Date(date);
    }

    await JobApplication.findOneAndUpdate(
        { _id: jobApplicationId, userId },
        updateFields
    );

    await saveActivity({
        userId,
        userActivityId: jobApplicationId,
        type: 'JOB_APPLIED',
        activity: `Job application details updated for ${jobTitle} at ${company}`
    })

    res.status(StatusCodes.OK).json({ msg: "job application updated successfully" });
};

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