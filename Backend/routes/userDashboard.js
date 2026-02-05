const express = require('express');
const {getRecentActivities} = require('../controllers/userDashboard');

const router = express.Router();

router.route('/recentActivity').get(getRecentActivities);

module.exports = router;