const express = require('express');
const {saveJobApplicationData, 
        getAllJobApplications, 
        removeJobApplication, 
        updateJobApplication, 
        getJobApplication,
        updateNote} = require('../controllers/job-application');

const router = express.Router();

router.route('/').post(saveJobApplicationData).get(getAllJobApplications).delete(removeJobApplication).patch(updateJobApplication);
router.route('/:jobApplicationId').get(getJobApplication);
router.route('/:jobApplicationId/note').patch(updateNote);

module.exports = router;