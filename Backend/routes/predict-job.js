const express = require('express')
const {getJobSuggestions} = require('../controllers/predict_job')

const router = express.Router();

router.route('/predict').post(getJobSuggestions);

module.exports = router;