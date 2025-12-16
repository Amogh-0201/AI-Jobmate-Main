const nameInput = document.querySelector('.js-name');
const emailInput = document.querySelector('.js-email');
const passwordInput = document.querySelector('.js-password');
const confirmPasswordInput = document.querySelector('.js-confirm-password');
const registerButton = document.querySelector('.js-register-button');
const errorMsgContainer = document.querySelector('.error-msg-container');

async function registerUser(){
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmedPassword = confirmPasswordInput.value;
    
    try{
        const response = await axios.post('/api/v1/auth/register',{
            name,
            email,
            password,
            confirmedPassword
        });

        const token = response.data.token;
        localStorage.setItem('token', token);

        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        window.location.href = '/dashboard';
    }catch(err){
        errorMsgContainer.innerHTML = err.response.data.msg;
        setTimeout(() => {
            errorMsgContainer.innerHTML = "";
        }, 3000);
        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
}
}
registerButton.addEventListener('click', ()=>{
    registerUser();
});