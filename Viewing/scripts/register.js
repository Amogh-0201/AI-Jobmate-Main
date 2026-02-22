//making the eye icon for hiding password invisible

const nameInput = document.querySelector('.js-name');
const emailInput = document.querySelector('.js-email');
const passwordInput = document.querySelector('.js-password');
const confirmPasswordInput = document.querySelector('.js-confirm-password');
const registerButton = document.querySelector('.js-register-button');
const errorMsgContainer = document.querySelector('.error-msg-container');
const otpInput = document.querySelector('.otp-input');
const otpErrorContainer = document.querySelector('.otp-error');
const verifyOtpBtn = document.querySelector('.verify-otp-btn');
const resendOtpBtn = document.querySelector('.resend-otp');

async function sendOtp() {
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmedPassword = confirmPasswordInput.value;
    
    try{
        document.querySelector('.otp-overlay').classList.remove('hidden');
        const response = await axios.post('/api/v1/auth/sendOtp',{
            name,
            email,
            password,
            confirmedPassword
        });

        const msg = response.data.msg;
        const otpSuccess = document.querySelector('.otp-success');

        otpSuccess.innerHTML = msg;
        otpSuccess.classList.remove('hidden');

        setTimeout(() => {
            otpSuccess.classList.add('hidden');
        }, 3000);
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

async function registerUser(){
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmedPassword = confirmPasswordInput.value;
    const otp = otpInput.value;
    
    try{
        const response = await axios.post('/api/v1/auth/register',{
            name,
            email,
            password,
            confirmedPassword,
            otp
        });

        const token = response.data.token;
        localStorage.setItem('token', token);

        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        document.querySelector('.otp-overlay').classList.add('hidden');
        window.location.href = '/user/dashboard';
    }catch(err){
        otpErrorContainer.innerHTML = err.response.data.msg;
        setTimeout(() => {
            otpErrorContainer.innerHTML = "";
        }, 3000);
    }
}

registerButton.addEventListener('click', async()=>{
    await sendOtp();
});

verifyOtpBtn.addEventListener('click', async() => {
    await registerUser();
});

resendOtpBtn.addEventListener('click', async() => {
    await sendOtp();
});
//password visible option

const passwordIconContainers = document.querySelectorAll('.show-password-icon-container');

passwordIconContainers.forEach(container => {

    const input = container.parentElement.querySelector('input');
    const showIcon = container.querySelector('.show-password');
    const hideIcon = container.querySelector('.hide-password');

    container.addEventListener('click', () => {

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        showIcon.classList.toggle('make-invisible');
        hideIcon.classList.toggle('make-invisible');
    });

});