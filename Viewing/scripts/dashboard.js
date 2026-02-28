const url = "http://localhost:3000";

//function to fetch the html of header and sidebar from components
async function includeHtml(className, file){
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

async function getJobApplications() {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${url}/api/v1/user/jobApplications`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data.jobApplications;
}

async function getSavedJobs() {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${url}/api/v1/user/savedJobs`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data.savedJobs;
}

//object to store key value pairs to generate a particular icon for a particular recent activity
const activityToIcon = {
    'JOB_APPLIED': 'check',
    'JOB_SAVED': 'bookmark',
    'RESUME_ANALYZED': 'file-text',
    'REMOVED':'x'
};
const activityToColor = {
    'JOB_APPLIED': 'applied',
    'JOB_SAVED': 'saved',
    'RESUME_ANALYZED': 'ai',
    'REMOVED': 'removed'
};

async function getRecentActivities(token) {
    const response = await axios.get(`${url}/api/v1/dashboard/recentActivity`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const recentActivities = response.data.recentActivities;
    return recentActivities;
}

async function loadDashboardPage(){
    try{
        const token = localStorage.getItem('token');
        if(!token) {
            window.location.href = "../login"
        }

        const response = await axios.get(`${url}/api/v1/user`, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        const user = response.data.user;
        //fetching html(header and sidebar) from components
        await includeHtml('.header','../components/header.html');
        await includeHtml('.sidebar','../components/sidebar.html');
        let theme = localStorage.getItem('theme');
        //theme handling
        if(!theme) {
            theme =  user.theme || 'light';
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        }

        /*code for logout button action*/
        const logoutBtn = document.querySelector('.logout-button');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                logout();
            });
        }
        document.querySelector('.name').innerHTML = user.name;
        const menuLinks = document.querySelectorAll('.sidebar-menu > a');
        menuLinks.forEach((link) => {
            link.classList.remove('active');

            if(link.classList.contains('dashboard')){
                link.classList.add('active');
            }
        });

        //showing total job applications, pendings, offers
        const totalJobApplications = await getJobApplications();
        document.querySelector('.no-of-job-applications').innerText = totalJobApplications.length;

        let pendingJobApplications = 0;
        let offers = 0;
        totalJobApplications.forEach((jobApplication) => {
            if(jobApplication.status === 'Pending') {
                pendingJobApplications++;
            } else if(jobApplication.status === 'Approved') {
                offers++;
            }
        });
        document.querySelector('.no-of-pendings').innerText = pendingJobApplications;
        document.querySelector('.no-of-offers').innerText = offers;

        const totalSavedJobs = await getSavedJobs();
        document.querySelector('.no-of-saved-jobs').innerText = totalSavedJobs.length;

        //showing recent activitis
        const recentActivitiesContainer = document.querySelector('.activity-list');
        const recentActivities = await getRecentActivities(token);
        recentActivitiesContainer.innerHTML = '';
        if(recentActivities.length === 0) {
            recentActivitiesContainer.innerHTML = `<h3 class="empty-activities">No Recent Activities</h3>`;
        }
        recentActivities.forEach((recentActivity) => {
            const type = recentActivity.type;
            const icon = activityToIcon[type] || 'activity'; // fallback icon
            const color = activityToColor[type] || 'applied';
            recentActivitiesContainer.innerHTML +=
            `
            <li class="activity-item">
                <span class="activity-icon ${color}"><i data-lucide="${icon}"></i></span>
                <div class="activity-content">
                    <p>
                        ${recentActivity.activity}
                    </p>
                    <span class="activity-time">${timeAgo(recentActivity.createdAt)}</span>
                </div>
            </li>
            `;
        });

        //showing suggestions
        const suggestionsContainer = document.querySelector('.suggestion-list');
        const res = await axios.post(`${url}/api/v1/dashboard/suggestions`, {
            pending: pendingJobApplications,
            offers: offers
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const suggestions = res.data.suggestions;
        suggestionsContainer.innerHTML = "";
        if(suggestions.length === 0) {
            suggestionsContainer.innerHTML = `<h3 class="empty-suggestions">No suggestions, keep learning, keep growing</h3>`;
        }
        suggestions.forEach((suggestion) => {
            suggestionsContainer.innerHTML += 
            `
            <div class="suggestion-card">
                <div class="suggestion-text">
                    <p class="suggestion-title">
                        ${suggestion.title}
                    </p>
                    <p class="suggestion-desc">
                        ${suggestion.description}
                    </p>
                </div>
                <button class="suggestion-btn" data-suggestion-id="${suggestion._id}">${suggestion.action}</button>
            </div>
            `;
        });

        //adding event listeners in suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach((suggestionButton) => {
            suggestionButton.addEventListener('click', (event) => {
                const suggestionId = event.target.dataset.suggestionId;
                if(suggestionId === 'Job_Application') {
                    window.location.href = "../applications";
                } else if(suggestionId === 'Saved_Job') {
                    window.location.href = "../savedjobs";
                } else if(suggestionId === 'Resume_AI') {
                    window.location.href = "../resumeAI";
                } else {
                    window.location.href = "../dashboard";
                }
            });
        });

        const menuToggle = document.querySelector(".menu-toggle");
        const sidebar = document.querySelector(".sidebar");

        if(menuToggle && sidebar){
            menuToggle.addEventListener("click", () => {
                sidebar.classList.toggle("active");
            });
        }

        //generating page icons
        lucide.createIcons();
    }catch(err){
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '../login';
    }
}

function timeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);

    if (diff < 60) return 'Just now';

    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}


loadDashboardPage();