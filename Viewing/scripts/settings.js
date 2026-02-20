//function to fetch the header and sidebar of the page
async function includeHtml(className, file) {
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

async function loadSettingsPage() {
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

        //theme handling
        const theme = localStorage.getItem('theme') || user.theme || 'light';
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        document.querySelector('.light-btn').classList.toggle('active', theme === 'light');
        document.querySelector('.dark-btn').classList.toggle('active', theme === 'dark');

        /*code for logout button action*/
        const logoutBtn = document.querySelector('.logout-button');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                logout();
            });
        }

        document.querySelector('.name').innerHTML = user.name;
        document.querySelector('.settings').classList.add('active');

    } catch(err) {
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '/login';
    }
}
loadSettingsPage();

document.querySelector('.toggle-group').addEventListener('click', async(event) => {
    const token = localStorage.getItem('token');
    const button = event.target;
    if(button.classList.contains('light-btn')) {
        document.querySelector('.dark-btn').classList.remove('active');
        button.classList.add('active');
        const theme = 'light';
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute("data-theme", theme);
        await axios.patch('/api/v1/user/theme', {theme}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    else if(button.classList.contains('dark-btn')) {
        document.querySelector('.light-btn').classList.remove('active');
        button.classList.add('active');
        const theme = 'dark';
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute("data-theme", theme);
        await axios.patch('/api/v1/user/theme', {theme}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
});

//change password
const changePasswordBtn = document.querySelector('.change-password-btn');
const modalOverlayVerify = document.querySelector('.modal-overlay-verify');
const cancelModalBtn = document.querySelector('.cancel-modal');
const verifyPasswordBtn = document.querySelector('.verify-password-btn');
const currentPasswordInput = document.querySelector('.current-password-input');
const modalError = document.querySelector('.modal-error');

const modalOverlayChange = document.querySelector('.modal-overlay-change');
const newModalError = document.querySelector('.new-password-error');
const backVerifyBtn = document.querySelector('.back-to-verify-btn');
const updatePasswordBtn = document.querySelector('.update-password-btn');
const newPasswordInput = document.querySelector('.new-password-input');
const confirmPasswordInput = document.querySelector('.confirm-password-input');
const successShow = document.querySelector('.password-updation-successful');

changePasswordBtn.addEventListener('click', () => {
    modalOverlayVerify.classList.remove('hidden');
    currentPasswordInput.value = '';
    modalError.textContent = '';
});
cancelModalBtn.addEventListener('click', () => {
    modalOverlayVerify.classList.add('hidden');
});

verifyPasswordBtn.addEventListener('click', async() => {
    try{
        const token = localStorage.getItem('token');
        const password = currentPasswordInput.value;
        const res = await axios.post('/api/v1/auth/verifyPassword', {password}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(res.data.msg === "Password Verification Successful") {
            modalOverlayVerify.classList.add('hidden');
            modalOverlayChange.classList.remove('hidden');
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
            newModalError.textContent = '';
        }
    } catch(err) {
        modalError.textContent = err.response?.data?.msg || "something went wrong";
        setTimeout(() => {
            modalError.textContent = '';
        }, 3000);
    }
});

backVerifyBtn.addEventListener('click', () => {
    modalOverlayChange.classList.add('hidden');
    modalOverlayVerify.classList.remove('hidden');
    currentPasswordInput.value = '';
    modalError.textContent = '';
});

updatePasswordBtn.addEventListener('click', async() => {
    try {
        const token = localStorage.getItem('token');
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const res = await axios.patch('/api/v1/auth/changePassword', {newPassword, confirmPassword}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(res.data.msg === "password changed successfully") {
            successShow.textContent = res.data.msg + '. Redirecting to Login Page...';
            setTimeout(() => {
                modalOverlayChange.classList.add('hidden');
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';
                newModalError.textContent = '';
                window.location.href = '/login';
            }, 3000);
        }
    } catch(err) {
        newModalError.textContent = err.response?.data?.msg || "something went wrong";
        setTimeout(()=>{
            newModalError.textContent = '';
        }, 3000);
    }
});