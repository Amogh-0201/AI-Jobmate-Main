//function to fetch the header and sidebar of the page
async function includeHtml(className, file) {
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

async function loadProfilePage() {
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

            if(link.classList.contains('profile')){
                link.classList.add('active');
            }
        });

    } catch(err) {
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '/login';
    }
}
loadProfilePage();