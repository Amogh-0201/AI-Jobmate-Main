const url = "http://localhost:3000";

//function to fetch the header and sidebar of the page
async function includeHtml(className, file) {
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

async function loadProfilePage() {
    try{
        const token = localStorage.getItem('token');
        if(!token) {
            window.location.href = "../login";
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

            if(link.classList.contains('profile')){
                link.classList.add('active');
            }
        });

        //showing user details
        document.querySelector('.user-name').innerHTML = user.name;
        document.querySelector('.user-email').innerHTML = 
        `${user.email}
        <span class="verified-badge">Verified</span>`;
        const dateString = giveDate(user.joinedDate);
        document.querySelector('.user-joined-time').innerHTML = dateString;
        if(user.targetRole) {
            document.querySelector('.target-role').innerHTML = user.targetRole;
        } else {
            document.querySelector('.target-role').innerHTML = "N.A.";
        }
        if(user.experienceLevel) {
            document.querySelector('.experience-level').innerHTML = user.experienceLevel;
        } else {
            document.querySelector('.experience-level').innerHTML = "N.A.";
        }

        const menuToggle = document.querySelector(".menu-toggle");
        const sidebar = document.querySelector(".sidebar");

        if(menuToggle && sidebar){
            menuToggle.addEventListener("click", () => {
                sidebar.classList.toggle("active");
            });
        }

    } catch(err) {
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '../login';
    }
}
loadProfilePage();

function giveDate(mongooseDate) {
    const date = mongooseDate.split('T')[0];
    const numMonthObj = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'   
    };
    const dateParts = date.split('-');
    const month = dateParts[1];
    const dateString = `${dateParts[2]} ${numMonthObj[month]} ${dateParts[0]}`;
    return dateString;
}

const targetInput = document.querySelector('.input-target');
const experienceInput = document.querySelector('.input-experience');

document.querySelector('.career-card').addEventListener('click', async(e) => {
    if(e.target.classList.contains('edit-btn')) {
        const editButton = e.target;
        const token = localStorage.getItem('token');
        const res = await axios.get(`${url}/api/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const user = res.data.user;
        if(user.targetRole) {
            targetInput.value = user.targetRole;
        }
        if(user.experienceLevel) {
            experienceInput.value = user.experienceLevel;
        }
        document.querySelector('.target-role').classList.add('hide');
        document.querySelector('.experience-level').classList.add('hide');
        targetInput.classList.remove('hide');
        experienceInput.classList.remove('hide');
        editButton.innerHTML = "Save";
        editButton.classList.add('save-btn');
        editButton.classList.remove('edit-btn');
        
    }
    else if(e.target.classList.contains('save-btn')) {
        const saveButton = e.target;
        const token = localStorage.getItem('token');
        const targetRole = targetInput.value;
        const experienceLevel = experienceInput.value;
        const res = await axios.patch(`${url}/api/v1/user`, {targetRole, experienceLevel}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const updatedUser = res.data.updatedUser;
        document.querySelector('.target-role').innerHTML = `${updatedUser.targetRole}`;
        document.querySelector('.experience-level').innerHTML = `${updatedUser.experienceLevel}`;

        document.querySelector('.target-role').classList.remove('hide');
        document.querySelector('.experience-level').classList.remove('hide');
        targetInput.classList.add('hide');
        experienceInput.classList.add('hide');
        saveButton.innerHTML = "Edit";
        saveButton.classList.add('edit-btn');
        saveButton.classList.remove('save-btn');
    }
});