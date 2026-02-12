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