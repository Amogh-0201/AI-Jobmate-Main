const nameInput = document.querySelector('.js-name');
const emailInput = document.querySelector('.js-email');
const passwordInput = document.querySelector('.js-password');
const confirmPasswordInput = document.querySelector('.js-confirm-password');
const registerButton = document.querySelector('.js-register-button');

async function registerUser(){
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmedPassword = confirmPasswordInput.value;
    
    const response = await axios.post('/api/v1/auth/register',{
        name,
        email,
        password,
        confirmedPassword
    });
    const token = response.data.token;
    console.log(token);
    localStorage.setItem('token', token);
}

registerButton.addEventListener('click', ()=>{
    registerUser();
    const token = localStorage.getItem('token');
});