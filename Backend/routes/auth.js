const express = require('express');
const {getLoginPage, getRegisterPage, register, login} = require('../controllers/auth');

const router = express.Router();

router.route('/login').get(getLoginPage).post(login);
router.route('/register').get(getRegisterPage).post(register);

module.exports = router;