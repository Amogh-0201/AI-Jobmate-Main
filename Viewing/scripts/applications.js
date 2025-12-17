lucide.createIcons();
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
        })
        console.log(response);

        //fetching html(header and sidebar) from components

        await includeHtml('.header','/components/header.html');
        await includeHtml('.sidebar','/components/sidebar.html');
        
        const menuLinks = document.querySelectorAll('.sidebar-menu > a');
        menuLinks.forEach((link) => {
            link.classList.remove('active');

            if(link.classList.contains('applications')){
                link.classList.add('active');
            }
        });

    }catch(err){
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '/login';
    }
}

loadApplicationsPage();

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
