const SkillGaps = require('../models/skill-gap');
const {getSkillGapSuggestions} = require('../services/skill-gap-llm.js');

const getSkillGaps = async(req, res) => {
    const {userId} = req.user;
    const resumeText = req.body.resumeText;
    const jobRole = req.body.jobRole;

    const rawResponse = await getSkillGapSuggestions({resumeText: resumeText, jobRole: jobRole});

    const parsedResponse = JSON.parse(rawResponse.replace(/```json/g, "").replace(/```/g, "").trim());
    //res.status(200).json({parsedResponse});

    const jsonObejct = {
        userId: userId, 
        resumeText: resumeText, 
        skillGaps: parsedResponse.skill_gaps, 
        overAllSuggestion: parsedResponse.overall_advice };

    const skillGaps = await SkillGaps.create(jsonObejct);
    res.status(201).json({"skillGaps": skillGaps.skillGaps, "overAllSuggestion": skillGaps.overAllSuggestion});
}

module.exports = {
    getSkillGaps
}