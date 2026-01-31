require('dotenv').config();
const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite"
})

const getSkillGapSuggestions = async({resumeText, jobRole}) => {
    const prompt = 
    `
        You are an AI Career Assistant.
        Analyze the resume Below for the JobRole: ${jobRole}.

        TASK:
        -Identify exactly 6 important skill gaps.
        -Do Not include skills already present in the resume.
        -Focus on practical, job relevant skills.

        OUTPUT FORMAT (STRICT JSON ONLY):
        {
            "skill_gaps": [
                {
                    "skill": "",
                    "priority": "High | Medium | Low",
                    "reason": "",
                    "suggestion": ""
                }
            ],
            "overall_advice": ""
        }


        RESUME:
        ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = {
    getSkillGapSuggestions
}