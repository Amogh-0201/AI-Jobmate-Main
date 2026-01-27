const axios = require('axios')
const JobSuggestions = require('../models/model_job_suggestions')
const {StatusCodes} = require('http-status-codes')
require('dotenv').config()

const getJobSuggestions = async(req, res) => {
    const url = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000/predict';
    const response = await axios.post(url, {
        resume: req.body.resume,
        top_k: req.body.top_k || 5
    }, {
        headers: {
            "x-api-key": process.env.ML_API_KEY
        }
    });

    const {userId} = req.user;
    const job_predictions = response.data.predictions;
    const jobSuggestions = await JobSuggestions.create({userId: userId, jobs: job_predictions});

    const historyCount = await JobSuggestions.countDocuments({userId});
    if(historyCount > 3) {
        const oldest = await JobSuggestions.findOne({userId}).sort({date:1});
        if(oldest) {
            await JobSuggestions.findOneAndDelete({userId: userId, _id: oldest._id});
        }
    }

    res.status(StatusCodes.CREATED).json(jobSuggestions.jobs);
}

module.exports = {
    getJobSuggestions
}