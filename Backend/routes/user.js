const express = require('express');
const {sendUserInfo, updateUserInfo} = require('../controllers/user');

const router = express.Router();

router.route('/').get(sendUserInfo).patch(updateUserInfo);

module.exports = router;