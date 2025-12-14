const emailInput = document.querySelector('.js-email-input');
const passwordInput = document.querySelector('.js-password-input');
const errorMsgContainer = document.querySelector('.error-msg-container');

async function login(){
    const email = emailInput.value;
    const password = passwordInput.value;
    try{
        const response = await axios.post('/api/v1/auth/login',{
            email,
            password
        });

        const token = response.token;
        localStorage.setItem('token', token);

        emailInput.value = "";
        passwordInput.value = "";
        window.location.href = '/dashboard';
    }catch(err){
        errorMsgContainer.innerHTML = err.response.data.msg;
        setTimeout(() => {
            errorMsgContainer.innerHTML = "";
        }, 3000);
        emailInput.value = "";
        passwordInput.value = "";
    }
}

document.querySelector('.login-button').addEventListener('click', ()=>{
    login();
});