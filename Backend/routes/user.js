const express = require('express');
const {sendUserInfo, updateUserInfo, updateTheme, sendOtpForDelete, deleteUser} = require('../controllers/user');

const router = express.Router();

router.route('/').get(sendUserInfo).patch(updateUserInfo).delete(deleteUser);
router.route('/theme').patch(updateTheme);
router.route('/sendOtp').post(sendOtpForDelete);

module.exports = router;