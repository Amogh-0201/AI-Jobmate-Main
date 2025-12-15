const express = require('express');
const {getLoginPage, getRegisterPage, getDashboardPage} = require('../controllers/getPage');
const authenticateUser = require('../middlewares/authenticate');

const router = express.Router();

router.route('/register').get(getRegisterPage);
router.route('/login').get(getLoginPage);
router.route('/dashboard').get(getDashboardPage);

module.exports = router;