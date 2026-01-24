//function to fetch the html of header and sidebar from components
async function includeHtml(className, file){
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

async function getJobApplications() {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/v1/user/jobApplications', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data.jobApplications;
}

async function getSavedJobs() {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/v1/user/savedJobs', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data.savedJobs;
}

async function loadDashboardPage(){
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
        //generating page icons
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

            if(link.classList.contains('dashboard')){
                link.classList.add('active');
            }
        });

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
    }catch(err){
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '/login';
    }
}

loadDashboardPage();