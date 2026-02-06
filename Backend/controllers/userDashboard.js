const Activities = require('../models/activities');
const JobApplication = require('../models/job-application');
const JobSuggestions = require('../models/model_job_suggestions');
const SavedJobs = require('../models/saved-job');
const SkillGaps = require('../models/skill-gap');

const getRecentActivities = async(req, res) => {
    const {userId} = req.user;
    const recentActivities = await Activities.find({userId: userId}).sort({createdAt:-1}).limit(3);
    res.status(200).json({successs: true, recentActivities});
}

const getSuggestions = async(req, res) => {
    const {userId} = req.user;
    const {pending, offers} =  req.body;
    const jobApplicationsCount = await JobApplication.countDocuments({userId});
    const jobSuggestionsCount = await JobSuggestions.countDocuments({userId});
    const savedJobsCount = await SavedJobs.countDocuments({userId});
    const skillGapsCount = await SkillGaps.countDocuments({userId});
    
    let suggestions = [];
    if(jobSuggestionsCount == 0 && skillGapsCount == 0) {
        suggestions.push({
            _id: 'Resume_AI',
            title: 'Use Resume AI to scan your resume and get job suggestions as well as improvement suggestions',
            description: `you have not scanned your resume yet, check our resume scanner`,
            action: 'RESUME_AI'
        });
    }
    if(jobApplicationsCount == 0) {
        suggestions.push({
            _id: 'Job_Application',
            title: 'Apply to jobs',
            description: `you did not applied to any jobs yet`,
            action: 'APPLY_JOB'
        });
    }
    if(savedJobsCount == 0) {
        suggestions.push({
            _id: 'Saved_Job',
            title: 'Add Saved Jobs',
            description: `you did not save any job yet`,
            action: 'SAVE_JOB'
        });
    }
    if(jobApplicationsCount >= 10 && offers/jobApplicationsCount < 0.2) {
        suggestions.push({
            _id: 'Resume_AI',
            title: 'Use Resume AI to scan your resume and get job suggestions as well as improvement suggestions',
            description: `More than 80% of your job applications are not approved`,
            action: 'RESUME_AI'
        });
    }
    const oldestJobApplication = await JobApplication.findOne({userId}).sort({date: 1});
    const oldestSavedJob = await SavedJobs.findOne({userId}).sort({date: 1});
    const recentResumeScan = await JobSuggestions.findOne({userId}).sort({date: -1});
    if(oldestJobApplication && longTimeAgo(oldestJobApplication.date)) {
        suggestions.push({
            _id: 'Job_Application',
            title: 'Update status or remove some job applications',
            description: `Job status has not been updated for some job applications for last 15 days or more`,
            action: 'APPLY_JOB'
        });
    }
    if(oldestSavedJob && longTimeAgo(oldestSavedJob.date)) {
        suggestions.push({
            _id: 'Saved_Job',
            title: 'Apply to saved job',
            description: `You did not apply to some saved jobs which were saved more than 15 days ago`,
            action: 'SAVE_JOB'
        });
    }
    const rejectedApplications = jobApplicationsCount-(pending + offers);
    if(jobApplicationsCount >= 10 && rejectedApplications/jobApplicationsCount > 0.6) {
        suggestions.push({
            _id: 'Resume_AI',
            title: 'Use Resume AI to scan your resume and get job suggestions as well as improvement suggestions',
            description: `More than 60% of your applications got rejected, apply for right jobs and upgrade proper required skills`,
            action: 'RESUME_AI'
        });
    }
    if(savedJobsCount > 6 && timeAgo(oldestSavedJob.date) > 864000) {
        suggestions.push({
            _id: 'Saved_Job',
            title: 'Apply to saved job',
            description: `You have more than 6 saved jobs and also some jobs are saved for more than 10 days`,
            action: 'SAVE_JOB'
        });
    }
    if(recentResumeScan && timeAgo(recentResumeScan) > 864000) {
        suggestions.push({
            _id: 'Resume_AI',
            title: 'Use Resume AI to scan your resume and get job suggestions as well as improvement suggestions',
            description: `You have not updated or scanned your resume for more than 10 days now`,
            action: 'RESUME_AI'
        });
    }

    res.status(201).json({suggestions});
}

function longTimeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);

    if (diff < 60) return false;

    const mins = Math.floor(diff / 60);
    if (mins < 60) return false;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return false;

    const days = Math.floor(hours / 24);
    if(days < 15) return false;

    return true;
}

function timeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    return diff;
}

module.exports = {
    getRecentActivities,
    getSuggestions
}