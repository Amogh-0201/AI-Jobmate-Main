//making the eye icon for hiding password invisible
document.querySelector('.hide-password').classList.add('make-invisible');
document.querySelector('.hide-confirm-password').classList.add('make-invisible');

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
        window.location.href = '/user/dashboard';
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

const confirmPasswordVisibleIcon =document.querySelector('.show-confirm-password-icon-container');

confirmPasswordVisibleIcon.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password'
        ? 'text'
        : 'password';
    
    confirmPasswordInput.setAttribute('type', type);

    if(type === 'password'){
        document.querySelector('.hide-confirm-password').classList.add('make-invisible');
        document.querySelector('.show-confirm-password').classList.remove('make-invisible');
    }else{
        document.querySelector('.show-confirm-password').classList.add('make-invisible');
        document.querySelector('.hide-confirm-password').classList.remove('make-invisible');
    }
});