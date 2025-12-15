const express = require('express');
const {sendUserInfo} = require('../controllers/dashboard');

const router = express.Router();

router.route('/').get(sendUserInfo);

module.exports = router;