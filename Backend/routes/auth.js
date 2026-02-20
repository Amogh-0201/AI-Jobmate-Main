const express = require('express');
const {
    register, 
    login, 
    verifyPassword, 
    changePassword 
} = require('../controllers/auth');
const authenticateUser = require('../middlewares/authenticate');

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/verifyPassword').post(authenticateUser, verifyPassword);
router.route('/changePassword').patch(authenticateUser, changePassword);

module.exports = router;