const express = require('express');
const {getLoginPage, getRegisterPage} = require('../controllers/auth');

const router = express.Router();

router.route('/login').get(getLoginPage);
router.route('/register').get(getRegisterPage);

module.exports = router;