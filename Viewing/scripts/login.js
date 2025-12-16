//making the eye icon for hiding password invisible
document.querySelector('.hide-password').classList.add('make-invisible');

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

        const token = response.data.token;
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


//password visible option

const passwordVisibleIcon = document.querySelector('.show-password-icon-container');

passwordVisibleIcon.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password'
        ? 'text'
        : 'password';
    
    passwordInput.setAttribute('type', type);

    if(type === 'password'){
        document.querySelector('.hide-password').classList.add('make-invisible');
        document.querySelector('.show-password').classList.remove('make-invisible');
    }else{
        document.querySelector('.show-password').classList.add('make-invisible');
        document.querySelector('.hide-password').classList.remove('make-invisible');
    }
});