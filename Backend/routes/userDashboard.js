const express = require('express');
const {getUserInfo} = require('../controllers/userDashboard');

const router = express.Router();

router.route('/dashboard').get(getUserInfo);

module.exports = router;