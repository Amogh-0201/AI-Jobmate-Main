const express = require('express');
const {getLoginPage, getRegisterPage, getDashboardPage, getApplicationsPage, getSavedjobsPage} = require('../controllers/getPage');
const authenticateUser = require('../middlewares/authenticate');

const router = express.Router();

router.route('/register').get(getRegisterPage);
router.route('/login').get(getLoginPage);
router.route('/user/dashboard').get(getDashboardPage);
router.route('/user/applications').get(getApplicationsPage);
router.route('/user/savedjobs').get(getSavedjobsPage);

module.exports = router;