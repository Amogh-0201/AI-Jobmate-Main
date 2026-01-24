const SavedJob = require('../models/saved-job');
const {StatusCodes} = require('http-status-codes');

//get all saved jobs by a user
const getAllSavedJobs = async(req, res) => {
    const {userId} = req.user;
    const {searchQuery, sort, date} = req.query;
    const queryObject = {
        userId: userId
    };
    //for date
    if(date) {
        const now = new Date();
        let startDate;
        if(date === 'today') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
        } else if(date === '7days') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if(date === '30days') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
        }
        if(startDate){
            queryObject.date = { $gte: startDate };
        }
    }
    //for sort
    let sortObject = {date: -1};
    if(sort === 'oldest') {
        sortObject = {date: 1};
    }
    //for search query
    if(searchQuery){
        queryObject.$or = [
            { jobTitle: {$regex: searchQuery, $options: 'i' } },
            { company: {$regex: searchQuery, $options: 'i' } }
        ];
    }

    const savedJobs = await SavedJob.find(queryObject).sort(sortObject);
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