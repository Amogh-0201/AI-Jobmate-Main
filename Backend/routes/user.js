const express = require('express');
const {sendUserInfo, updateUserInfo, updateTheme} = require('../controllers/user');

const router = express.Router();

router.route('/').get(sendUserInfo).patch(updateUserInfo);
router.route('/theme').patch(updateTheme);

module.exports = router;