lucide.createIcons();
//function to fetch the html of header and sidebar from components
async function includeHtml(className, file){
    const res = await fetch(file);
    document.querySelector(className).innerHTML = await res.text();
}

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