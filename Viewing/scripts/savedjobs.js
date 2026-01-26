let savedJobsQueryState = {
    searchQuery: '',
    sort: 'newest',
    date: 'all'
};

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
        },
        params: {
            searchQuery: savedJobsQueryState.searchQuery,
            sort: savedJobsQueryState.sort,
            date: savedJobsQueryState.date
        }
    });
    return response;
}

const searchInput = document.querySelector('.search-input');
const dateSelect = document.querySelector('.select-date');
const sortSelect = document.querySelector('.select-sort');
let debounceTimer;

searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async() => {
        savedJobsQueryState.searchQuery = searchInput.value.trim();
        await loadSavedjobsPage();
    }, 300);
});
dateSelect.addEventListener('change', async() => {
    savedJobsQueryState.date = dateSelect.value;
    await loadSavedjobsPage();
});
sortSelect.addEventListener('change', async() => {
    savedJobsQueryState.sort = sortSelect.value;
    await loadSavedjobsPage();
});

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
        if(savedJobs.length === 0) {
            savedJobCardsContainer.innerHTML = 
            `
                <div class="no-saved-jobs">
                    <p>No Saved Jobs</p>
                </div>
            `;
        }
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
                    <button class="apply-btn" data-saved-job-id="${savedJob._id}">Apply</button>
                    <button class="remove-btn" data-saved-job-id="${savedJob._id}">Remove</button>
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
    try{
        const token = localStorage.getItem('token');
        await saveJob(token);
        closeDrawer();
        jobTitleInput.value = '';
        companyInput.value = '';
        roleInput.value = '';
        dateInput.value = '';
        loadSavedjobsPage();
    }catch(err) {
        document.querySelector('.err-msg-section').innerText =
            err.response?.data?.msg || 'Failed to save application';
        setTimeout(() => {
            document.querySelector('.err-msg-section').innerText = '';
        }, 3000);
        return; // drawer stays open
    }    
});

//function to delete a saved job i.e. working of the remove button
async function removeSavedJob(button) {
    const token = localStorage.getItem('token');
    await axios.delete('/api/v1/user/savedJobs',{
        data: {
            savedJobId: button.dataset.savedJobId
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

//funciton to make apply button interactive i.e. save the job to job applications
async function applyJob(button) {
    const token = localStorage.getItem('token');

    const savedJobId = button.dataset.savedJobId;
    const res = await axios.get(`/api/v1/user/savedJobs/${savedJobId}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const {savedJob} = res.data;
    const {jobTitle, company} = savedJob;
    const status = 'Pending';
    const payload = {
        jobTitle,
        company,
        status
    };
    await axios.post('/api/v1/user/jobApplications', payload,{
        headers: {
            Authorization:`Bearer ${token}`
        }
    });
}

document.querySelector('.saved-jobs-list').addEventListener('click', async(event) => {
    //remove a saved job
    if(event.target.classList.contains('remove-btn')) {
        const removeButton = event.target;
        await removeSavedJob(removeButton);
        await loadSavedjobsPage();
    }

    //apply for a job
    if(event.target.classList.contains('apply-btn')) {
        const applyButton = event.target;
        await applyJob(applyButton);
        await removeSavedJob(applyButton);
        await loadSavedjobsPage();
    }
});