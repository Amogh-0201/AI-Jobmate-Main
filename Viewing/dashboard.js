const token = localStorage.getItem('token');
if(!token){
    window.location.href = '/login';
}

const user = await axios.get('/api/v1/user/dashboard', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

console.log(user);