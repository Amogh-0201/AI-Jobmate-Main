//function to fetch the html of header and sidebar from components
async function includeHtml(className, file){
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

async function loadResumeAiPage() {
    try{
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/v1/user', {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        const user = response.data.user;

        //fetching html(header and sidebar) from components
        await includeHtml('.header','/components/header.html');
        await includeHtml('.sidebar','/components/sidebar.html');
        let theme = localStorage.getItem('theme');
        
        //theme handling
        if(!theme) {
            theme =  user.theme || 'light';
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        }
        
        document.querySelector('.name').innerHTML = user.name;
        const menuLinks = document.querySelectorAll('.sidebar-menu > a');
        menuLinks.forEach((link) => {
            link.classList.remove('active');
            if(link.classList.contains('resume-ai')){
                link.classList.add('active');
            }
        });

    }catch(err) {
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '/login';
    }
}

loadResumeAiPage();

const resumeTextInput = document.querySelector('.resume-text-input');
//showing clear text button while entering resume text
const clearTextBtn = document.querySelector('.clear-text-btn');

resumeTextInput.addEventListener('input', () => {
    clearTextBtn.style.display =
        resumeTextInput.value.trim().length > 0 ? 'block' : 'none';
});

clearTextBtn.addEventListener('click', () => {
    resumeTextInput.value = '';
    clearTextBtn.style.display = 'none';
    AiSuggestionsContainer.classList.add('hide-card');
    skillGapsContainer.classList.add('hide-card');
});

//extract resume text from the pdf
const resumePdfInput = document.getElementById('resume-pdf-input');
const uploadedFileBox = document.querySelector('.uploaded-file');
const uploadedFileName = document.querySelector('.file-name');
const removePdfBtn = document.querySelector('.remove-pdf-btn')

let selectedPdfFile = null;

resumePdfInput.addEventListener('change', (event) => {  //saving resume pdf to a variable
    selectedPdfFile = event.target.files[0];

    if(!selectedPdfFile) return;

    if(selectedPdfFile.type !== "application/pdf") {
        alert('Please upload a pdf file only');
        selectedPdfFile = null;
        return;
    }

    console.log(selectedPdfFile);
    uploadedFileBox.classList.remove('hide');
});

removePdfBtn.addEventListener('click', () => {
    selectedPdfFile = null;
    resumePdfInput.value = '';
    uploadedFileBox.classList.add('hide');
    AiSuggestionsContainer.classList.add('hide-card');
    skillGapsContainer.classList.add('hide-card');
});


async function extractTextFromResumePdf() { //extracting text from pdf and returning it
    if (!selectedPdfFile) {
        alert("Please upload a resume PDF first");
        return;
    }

    const formData = new FormData();
    formData.append('resume', selectedPdfFile);
    
    const response = await axios.post('/api/v1/resumePdf/extract', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data.resumeText;
}


//giving job suggestions using AI

const analyzeResumeButton = document.querySelector('.analyze-resume-btn');

async function getJobSuggestions(resumeText) {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/v1/model/v1/predict', 
    {
        resume: resumeText
    }, 
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const suggestedJobs = response.data;
    return suggestedJobs;
}

const AiSuggestionsContainer = document.querySelector('.result-card');

function OtherAiSuggestedJobs(AiSuggestedJobs, limit) {
    let html = ``;
    for(let i = 1; i < limit; i++) {
        html += 
        `
            <div class="alt-role">
                <div class="alt-header">
                    <span>${AiSuggestedJobs[i].job}</span>
                    <span>${AiSuggestedJobs[i].confidence}</span>
                </div>
                <div class="alt-bar">
                    <div class="alt-fill" style="width:${AiSuggestedJobs[i].confidence}"></div>
                </div>
            </div>
        `;
    }
    return html;
}

const jobRoleInput = document.querySelector('.job-role-input');
const skillGapsContainer = document.querySelector('.skill-gap-card');

async function getSkillGaps(resumeText, jobRole) {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/v1/gemini/skillGaps', {resumeText, jobRole}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const skillGapAnalysis = response.data;
    return skillGapAnalysis;
}

analyzeResumeButton.addEventListener('click', async() => {
    let resumeText = "";
    if (resumeTextInput.value.trim().length > 0) {
        resumeText = resumeTextInput.value.trim();
    } else if (selectedPdfFile) {
        resumeText = await extractTextFromResumePdf();
    } else {
        alert("Please enter resume text or upload a PDF");
        return;
    }

    //ai suggested jobs section
    const AiSuggestedJobs = await getJobSuggestions(resumeText);

    if (!AiSuggestedJobs || AiSuggestedJobs.length === 0) {
        AiSuggestionsContainer.innerHTML = `<p>No suggestions available.</p>`;
        return;
    }
    AiSuggestionsContainer.classList.remove('hide-card');
    AiSuggestionsContainer.innerHTML = 
    `
        <h2>AI Job Suggestions</h2>

        <p><strong>Best Matched Role</strong></p>
        <h3>${AiSuggestedJobs[0].job}</h3>

        <strong>Confidence: ${AiSuggestedJobs[0].confidence}</strong>
        <div class="confidence-bar">
            <div class="confidence-fill" style="width:${AiSuggestedJobs[0].confidence}"></div>
        </div>

        <p style="margin-top:20px;"><strong>Other Suitable Roles</strong></p>
    `;
    AiSuggestionsContainer.innerHTML += OtherAiSuggestedJobs(AiSuggestedJobs, 5);

    //ai skill gaps analysis section
    const jobRole = jobRoleInput.value;
    if(!jobRole) {
        skillGapsContainer.innerHTML = 
        `
        <h2>AI Skill Gap Analysis</h2>
        <p class="subtitle">
            Based on your resume, here are the most important skills to focus on next:
        </p>
        <div class="skill-gap-item high">
            <div class="skill-header">
                <span class="skill-name">NO INTERESTED JOBROLE IS ENTERED</span>
            </div>
        </div>
        `;
        skillGapsContainer.classList.remove('hide-card');
    } else if(jobRole) {
        skillGapsContainer.innerHTML = `
            <h2>AI Skill Gap Analysis</h2>
            <p class="subtitle">
                Based on your resume, here are the most important skills to focus on next:
            </p>
            <div id="aiThinking" class="ai-thinking">
                Analyzing your resume
                <span id="thinkingDots"></span>
            </div>
            <!-- Skill Item -->
        `;
        skillGapsContainer.classList.remove('hide-card');
        let dots = 0;
        const thinkingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            document.getElementById("thinkingDots").textContent = ".".repeat(dots);
        }, 500);
        const skillGapAnalysis = await getSkillGaps(resumeText, jobRole);
        skillGapAnalysis.skillGaps.forEach((skillGap) => {
            skillGapsContainer.innerHTML += 
            `
            <div class="skill-gap-item ${skillGap.priority}">
                <div class="skill-header">
                    <span class="skill-name">${skillGap.skill}</span>
                    <span class="priority-badge ${skillGap.priority}">${skillGap.priority} Priority</span>
                </div>
                <p class="reason">
                    ${skillGap.reason}
                </p>
                <p class="suggestion">
                    👉 ${skillGap.suggestion}
                </p>
            </div>
            `;
        });
        skillGapsContainer.innerHTML += 
        `
        <!-- Overall Suggestion -->
            <div class="overall-suggestion">
                <h3>Overall AI Recommendation</h3>
                <p>
                    ${skillGapAnalysis.overAllSuggestion}
                </p>
            </div>

            <p class="note">
                * These suggestions are AI-generated and will improve as your profile evolves. It also can give different result for repeated inputs.
            </p>
        `;

        clearInterval(thinkingInterval);
        document.querySelector(".ai-thinking").classList.add('hidden');
    }
});