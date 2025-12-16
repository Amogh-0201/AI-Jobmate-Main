//generating page icons
lucide.createIcons();

async function loadDashboardPage(){
    try{
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/v1/dashboard', {
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        console.log(response);
    }catch(err){
        console.log(err);
        document.body.innerHTML = `<h3>${err.response.data.msg}</h3>`;
        window.location.href = '/login';
    }
}

//loadDashboardPage();