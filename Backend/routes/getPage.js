const express = require('express');
const {getLoginPage, getRegisterPage} = require('../controllers/getPage');

const router = express.Router();

router.route('/register').get(getRegisterPage);
router.route('/login').get(getLoginPage);

module.exports = router;