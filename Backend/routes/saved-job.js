const express = require('express');
const {
    getAllSavedJobs,
    saveSavedJob
} = require('../controllers/saved-job');

const router = express.Router();

router.route('/').get(getAllSavedJobs).post(saveSavedJob);

module.exports = router;