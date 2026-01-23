const express = require('express');
const {
    getAllSavedJobs,
    saveSavedJob,
    deleteSavedJob,
    getSavedJob
} = require('../controllers/saved-job');

const router = express.Router();

router.route('/').get(getAllSavedJobs).post(saveSavedJob).delete(deleteSavedJob);
router.route('/:savedJobId').get(getSavedJob);

module.exports = router;