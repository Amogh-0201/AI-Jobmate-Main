//generating page icons
lucide.createIcons();

//function to fetch the html of header and sidebar from components
async function includeHtml(className, file){
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

async function loadDashboardPage(){
    try{
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/v1/user', {
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        console.log(response);

        //fetching html(header and sidebar) from components

        await includeHtml('.header','/components/header.html');
        await includeHtml('.sidebar','/components/sidebar.html');

        const menuLinks = document.querySelectorAll('.sidebar-menu > a');
        menuLinks.forEach((link) => {
            link.classList.remove('active');

            if(link.classList.contains('dashboard')){
                link.classList.add('active');
            }
        });

    }catch(err){
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '/login';
    }
}

loadDashboardPage();