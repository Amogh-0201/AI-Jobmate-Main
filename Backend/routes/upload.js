const express = require('express');
const {extractResumeText} = require('../controllers/upload');

const router = express.Router();

router.route('/extract').post(extractResumeText);

module.exports = router;