const express = require('express');
const {saveJobApplicationData, getAllJobApplications} = require('../controllers/job-application');

const router = express.Router();

router.route('/').post(saveJobApplicationData).get(getAllJobApplications);


module.exports = router;