const express = require('express');
const {saveJobApplicationData, 
        getAllJobApplications, 
        removeJobApplication, 
        updateJobApplication, 
        getJobApplication} = require('../controllers/job-application');

const router = express.Router();

router.route('/').post(saveJobApplicationData).get(getAllJobApplications).delete(removeJobApplication).patch(updateJobApplication);
router.route('/:jobApplicationId').get(getJobApplication);


module.exports = router;