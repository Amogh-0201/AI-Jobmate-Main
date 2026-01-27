const pdf = require('pdf-parse');

//convert resumepdf to resumetext
const extractResumeText = async(req, res) => {
    try{
        if(!req.file) {
            return res.status(400).json({ message: "No PDF uploaded" });
        }
        const data = await pdf(req.file.buffer);
        const resumeText = data.text
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

        if (!resumeText || resumeText.trim().length < 20) {
            return res.status(422).json({
                message: "Could not extract readable text from PDF or resume text is too short"
            });
        }

        res.status(200).json({ resumeText });
    }catch(err) {
        console.error('PDF extraction error:', err);
        res.status(500).json({ message: "PDF processing failed" });
    }
}

module.exports = {
    extractResumeText
}