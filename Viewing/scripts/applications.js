async function createApplicationsPage(){
    //function to fetch the html of header and sidebar from components
    async function includeHtml(className, file){
        const res = await fetch(file);
        document.querySelector(className).innerHTML = await res.text();
    }

    async function loadApplicationsPage(){
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
            lucide.createIcons();
            /*code for logout button action*/
            const logoutBtn = document.querySelector('.logout-button');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    logout();
                });
            }

            const user = response.data.user;
            document.querySelector('.name').innerHTML = user.name;

            const menuLinks = document.querySelectorAll('.sidebar-menu > a');
            menuLinks.forEach((link) => {
                link.classList.remove('active');

                if(link.classList.contains('applications')){
                    link.classList.add('active');
                }
            });
            await loadJobsSection();
        }catch(err){
            console.log(err);
            document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
            window.location.href = '/login';
        }
    }

    await loadApplicationsPage();

    /*code for loading job cards section*/
    async function loadJobsSection(){
        const token = localStorage.getItem('token');

        const jobCardsSection = document.querySelector('.jobs-section'); 
        const res = await axios.get('/api/v1/user/jobApplications', {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        const allJobApplications = res.data.allJobApplications;
        jobCardsSection.innerHTML = "";
        if(allJobApplications.length === 0){
            jobCardsSection.innerHTML = 
            `
                <div class="no-applications">
                    <p>No job applications to show yet.</p>
                    <span>Once you start applying, your applications will appear here.</span>
                </div>
            `;
        }
        allJobApplications.forEach((jobApplication) => {
            const dateValue = jobApplication.date
            ? jobApplication.date.split('T')[0]
            : '—';
            jobCardsSection.innerHTML +=
            `
                <div class="job-card">
                    <div class="job-card-header">
                        <div class="job-info">
                            <h3 class="job-title">${jobApplication.jobTitle}</h3>
                            <p class="company-name">${jobApplication.company}</p>
                        </div>
                        <span class="job-status ${jobApplication.status}">${jobApplication.status}</span>
                    </div>

                    <div class="job-meta">
                        <span>Applied on: ${dateValue}</span>
                        <span>Application ID: #A${jobApplication._id.slice(-4)}</span>
                    </div>

                    <div class="job-actions">
                        <button class="btn view">View</button>
                        <button class="btn approve">Approve</button>
                        <button class="btn reject">Reject</button>
                    </div>
                </div>
            `;
        });
    }

    /*the following code is for sliding panel of add new applications*/
    const openBtn = document.querySelector('.add-application-button');
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

    /*code for creating new job application*/
    const jobTitleInput = document.querySelector('.job-title-input');
    const companyNameInput = document.querySelector('.company-name-input');
    const statusValueInput = document.querySelector('.status-value');
    const appliedDateInput = document.querySelector('.applied-date');

    async function saveJobApplication(){
        try{
            const token = localStorage.getItem('token');

            const jobTitle = jobTitleInput.value;
            const company = companyNameInput.value;
            const status = statusValueInput.value;
            const dateValue = appliedDateInput.value;
            const payload = {
                jobTitle,
                company,
                status
            };

            // ONLY add date if user selected it
            if (dateValue) {
                payload.date = dateValue;
            }
            const jobApplication = await axios.post('/api/v1/user/jobApplications', payload, 
            {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            });
            console.log(jobApplication);
        }catch(err){
            console.log(err);
        }
    }

    document.querySelector('.submit-btn').addEventListener('click', async() => {
        await saveJobApplication();
        closeDrawer();
        jobTitleInput.value = "";
        companyNameInput.value = "";
        statusValueInput.value = "Pending";
        appliedDateInput.value = "";
        await loadJobsSection();
    });
}

createApplicationsPage();