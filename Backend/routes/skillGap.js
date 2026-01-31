const express = require('express');
const {getSkillGaps} = require('../controllers/skillGap');

const router = express.Router();

router.route('/').post(getSkillGaps);

module.exports = router;