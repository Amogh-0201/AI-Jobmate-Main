lucide.createIcons();
//function to fetch the html of header and sidebar from components
async function includeHtml(className, file){
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

//function to get the all saved jobs
async function getSavedJobs(token) {
    const response = await axios.get('/api/v1/user/savedJobs', {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    return response;
}


async function loadSavedjobsPage(){
    try{
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/v1/user', {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        //fetching html(header and sidebar) from components
        await includeHtml('.header','/components/header.html');
        await includeHtml('.sidebar','/components/sidebar.html');
        const user = response.data.user;
        document.querySelector('.name').innerHTML = user.name;      
        const menuLinks = document.querySelectorAll('.sidebar-menu > a');
        menuLinks.forEach((link) => {
            link.classList.remove('active');
            if(link.classList.contains('saved-jobs')){
                link.classList.add('active');
            }
        });

        //showing the saved jobs
        const res = await getSavedJobs(token);
        const savedJobs = res.data.savedJobs;
        const savedJobCardsContainer = document.querySelector('.saved-jobs-list');
        document.querySelector('.count-value').innerText = `${savedJobs.length}`;
        savedJobCardsContainer.innerHTML = "";
        savedJobs.forEach((savedJob) => {
            savedJobCardsContainer.innerHTML += 
            `
            <div class="saved-job-card">
                <div class="job-main">
                    <h3 class="job-title">${savedJob.jobTitle}</h3>

                    <div class="job-meta">
                        <span class="job-email">${savedJob.company}</span>
                        <span class="dot">•</span>
                        <span class="job-date">Saved on ${savedJob.date.split('T')[0]}</span>
                    </div>

                    <div class="job-role">
                        Role: <strong>${savedJob.role}</strong>
                    </div>
                </div>

                <div class="job-actions">
                    <button class="apply-btn">Apply</button>
                    <button class="remove-btn">Remove</button>
                </div>
            </div>
            `
        });

    }catch(err){
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '/login';
    }
}

loadSavedjobsPage();

const openBtn = document.querySelector('.add-new-saved-job-button');
const drawer = document.getElementById('applicationDrawer');
const overlay = document.getElementById('drawerOverlay');
const closeBtn = document.querySelector('.close-drawer');

openBtn.addEventListener('click', () => {
  drawer.classList.add('open');
  overlay.classList.add('show');
});

closeBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('show');
}

//save a savedjob
const jobTitleInput = document.querySelector('.job-title-input');
const companyInput = document.querySelector('.company-input');
const roleInput = document.querySelector('.role-input');
const dateInput = document.querySelector('.date-input');

async function saveJob(token) {
    const jobTitle = jobTitleInput.value;
    const company = companyInput.value;
    const role = roleInput.value;
    const dateValue = dateInput.value;

    const payload = {
        jobTitle,
        company,
        role
    };
    if(dateValue){
        payload.date = dateValue;
    }

    await axios.post('/api/v1/user/savedJobs', payload, 
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

const saveJobButton = document.querySelector('.submit-btn');
saveJobButton.addEventListener('click', async() => {
    const token = localStorage.getItem('token');
    await saveJob(token);
    closeDrawer();
    jobTitleInput.value = "";
    companyInput.value = "";
    roleInput.value = "";
    dateInput.value = "";
    loadSavedjobsPage();
});