const express = require('express');
const {getRecentActivities, getSuggestions} = require('../controllers/userDashboard');

const router = express.Router();

router.route('/recentActivity').get(getRecentActivities);
router.route('/suggestions').post(getSuggestions);

module.exports = router;