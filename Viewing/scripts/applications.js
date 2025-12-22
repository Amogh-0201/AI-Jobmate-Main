async function createApplicationsPage(){
    let isEditMode = false;
    let editingJobId = "";
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

                    <div class="job-note">
                        <span class="note-label">Note:</span>
                        <p class="note-text">
                            ${jobApplication.note || 'No notes added yet.'}
                        </p>
                    </div>

                    <div class="job-actions">
                        <button class="btn edit" data-job-application-id = "${jobApplication._id}">Edit</button>
                        <button class="btn addNote" data-job-application-id = "${jobApplication._id}">+Add Note</button>
                        <button class="btn remove" data-job-application-id = "${jobApplication._id}" data-note ="${jobApplication.note || ''}">Remove</button>
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

    closeBtn.addEventListener('click', () => {
        resetDrawer();
        closeDrawer();
    });
    overlay.addEventListener('click', () => {
        resetDrawer();
        closeDrawer();
    });

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('show');
    }

    /*code for creating new job application*/
    const jobTitleInput = document.querySelector('.job-title-input');
    const companyNameInput = document.querySelector('.company-name-input');
    const statusValueInput = document.querySelector('.status-value');
    const appliedDateInput = document.querySelector('.applied-date');
    const noteInput = document.querySelector('.note');

    async function saveJobApplication(){
        const token = localStorage.getItem('token');

        const jobTitle = jobTitleInput.value;
        const company = companyNameInput.value;
        const status = statusValueInput.value;
        const dateValue = appliedDateInput.value;
        const noteValue = noteInput.value;
        const payload = {
            jobTitle,
            company,
            status
        };

        // ONLY add date and note if user selected it
        if (dateValue) {
            payload.date = dateValue;
        }
        if(noteValue){
            payload.note = noteValue;
        }
        await axios.post('/api/v1/user/jobApplications', payload, 
        {
            headers: {
                Authorization:`Bearer ${token}`
            }
        });
    }

    document.querySelector('.submit-btn').addEventListener('click', async() => {
        try{
            if(isEditMode) {
                await updateJobApplication();
            }else{
                await saveJobApplication();
            }
            resetDrawer();
            closeDrawer();
            
            await loadJobsSection();
        }
        catch(err) {
            document.querySelector('.err-msg-section').innerText =
                err.response?.data?.msg || 'Failed to save application';
            setTimeout(() => {
                document.querySelector('.err-msg-section').innerText = '';
            }, 3000);
            return; // drawer stays open
        }
        
    });

    function resetDrawer() {
        isEditMode = false;
        editingJobId = null;

        jobTitleInput.value = '';
        companyNameInput.value = '';
        statusValueInput.value = 'Pending';
        appliedDateInput.value = '';
        noteInput.value = '';

        document.querySelector('.drawer-title').innerText = 'New Application';
        document.querySelector('.submit-btn').innerText = 'Save Application';
    }

    //delete a job application
    async function removeJobApplication(button){
        const token = localStorage.getItem('token');
        const res = await axios.delete('/api/v1/user/jobApplications',{ 
            data: {
                jobApplicationId : button.dataset.jobApplicationId
            },             
            headers: {
                Authorization:`Bearer ${token}`
            }
        });
        console.log(res.data.msg);
    }

    //edit a job application
    async function updateJobApplication() {
        const token = localStorage.getItem('token');

        const jobTitle = jobTitleInput.value;
        const company = companyNameInput.value;
        const status = statusValueInput.value;
        const dateValue = appliedDateInput.value;
        const noteValue = noteInput.value;

        const payload = {
            jobApplicationId : editingJobId,
            jobTitle,
            company,
            status
        }
        // ONLY add date and note if user selected it
        if (dateValue) {
            payload.date = dateValue;
        }
        if(noteValue){
            payload.note = noteValue;
        }
        
        const res = await axios.patch('/api/v1/user/jobApplications', payload,
        {            
            headers: {
                Authorization:`Bearer ${token}`
            }
        });
        console.log(res.data.msg);
    }

    //adding event listener for the deletion and editing and add/edit note button
    const noteModalOverlay = document.getElementById('noteModalOverlay');
    const noteModalInput = document.getElementById('noteModalInput');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const cancelNoteBtn = document.getElementById('cancelNoteBtn');

    let activeJobId = null;

    document.querySelector('.jobs-section').addEventListener('click', async(event) => {
        //for remove job application
        if(event.target.classList.contains('remove')) {
            const removeButton = event.target;

            await removeJobApplication(removeButton);
            await loadJobsSection();
        }
        //for edit job application
        else if(event.target.classList.contains('edit')) {
            const editButton = event.target;
            const jobApplicationId = editButton.dataset.jobApplicationId;
            const token = localStorage.getItem('token');

            //open drawer
            drawer.classList.add('open');
            overlay.classList.add('show');

            //get jobApplication info
            const res = await axios.get(`/api/v1/user/jobApplications/${jobApplicationId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const job = res.data.jobApplication;

            // fill inputs
            jobTitleInput.value = job.jobTitle;
            companyNameInput.value = job.company;
            statusValueInput.value = job.status;
            appliedDateInput.value = job.date
                ? new Date(job.date).toISOString().split('T')[0]
                : '';
            noteInput.value = job.note || '';

            // switch mode
            isEditMode = true;
            editingJobId = jobApplicationId;

            // update UI
            document.querySelector('.drawer-title').innerHTML = 'Edit Application';
            document.querySelector('.submit-btn').innerText = 'Update Application';
        }
        //add note button
        else if(event.target.classList.contains('addNote')){
            activeJobId = event.target.dataset.jobApplicationId;
            noteModalInput.value = event.target.dataset.note || '';
            noteModalOverlay.classList.remove('hidden');
            noteModalInput.focus();
        }
        else{
            return;
        }
    });

    //close note modal
    function closeNoteModal() {
        noteModalOverlay.classList.add('hidden');
        noteModalInput.value = '';
        activeJobId = null;
    }
    cancelNoteBtn.addEventListener('click', closeNoteModal);
    noteModalOverlay.addEventListener('click', (e) => {
        if (e.target === noteModalOverlay) {
            closeNoteModal();
        }
    });

    saveNoteBtn.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            const note = noteModalInput.value.trim();

            await axios.patch(
            `/api/v1/user/jobApplications/${activeJobId}/note`,
            { note },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
            );

            closeNoteModal();
            await loadJobsSection(); // refresh cards

        } catch (err) {
            alert('Failed to save note');
        }
    });

}

createApplicationsPage();