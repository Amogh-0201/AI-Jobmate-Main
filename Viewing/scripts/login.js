const url = "https://ai-jobmate-backend.onrender.com";

//making the eye icon for hiding password invisible
document.querySelector('.hide-password').classList.add('make-invisible');

const emailInput = document.querySelector('.js-email-input');
const passwordInput = document.querySelector('.js-password-input');
const errorMsgContainer = document.querySelector('.error-msg-container');

async function login(){
    const email = emailInput.value;
    const password = passwordInput.value;
    try{
        const response = await axios.post(`${url}/api/v1/auth/login`,{
            email,
            password
        });

        const token = response.data.token;
        localStorage.setItem('token', token);

        emailInput.value = "";
        passwordInput.value = "";
        window.location.href = '../dashboard';
    }catch(err){
        errorMsgContainer.innerHTML = err.response?.data?.msg || "server connection failed";
        setTimeout(() => {
            errorMsgContainer.innerHTML = "";
        }, 3000);
        emailInput.value = "";
        passwordInput.value = "";
    }
}

document.querySelector('.login-button').addEventListener('click', async()=>{
    await login();
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


// ===============================
// FORGOT PASSWORD OVERLAY LOGIC
// ===============================

const forgotOverlay = document.querySelector('.forgot-overlay');
const forgotLink = document.querySelector('.forgot-password-link');
const closeForgotOverlay = document.querySelector('.close-forgot-overlay');

const stepEmail = document.querySelector('.forgot-step-email');
const stepOtp = document.querySelector('.forgot-step-otp');
const stepReset = document.querySelector('.forgot-step-reset');

const forgotErrorMsgContainer = document.querySelector('.forgot-error-msg');
const forgotEmailInput = document.querySelector('.js-forgot-email');
const otpInput = document.querySelector('.js-forgot-otp');
const newPasswordInput = document.querySelector('.js-new-password');
const newConfirmPasswordInput = document.querySelector('.js-confirm-new-password');

// Open overlay
forgotLink.addEventListener('click', (e)=>{
    e.preventDefault();
    forgotOverlay.style.display = "flex";
});

// Close overlay
closeForgotOverlay.addEventListener('click', ()=>{
    forgotOverlay.style.display = "none";
    forgotEmailInput.value = "";
    otpInput.value = "";
    newPasswordInput.value = "";
    newConfirmPasswordInput.value = "";
});


document.querySelector('.js-send-otp-btn').addEventListener('click', async()=>{
    try {
        stepEmail.classList.add('make-invisible');
        stepOtp.classList.remove('make-invisible');

        const email = forgotEmailInput.value;
        await axios.post(`${url}/api/v1/auth/forgotPassword/sendOtp`, {email});

    } catch(err) {
        forgotErrorMsgContainer.textContent = err.response?.data?.msg || 'something went wrong!';
        setTimeout(() => {
            forgotErrorMsgContainer.textContent = "";
        }, 3000);
    }
});


document.querySelector('.js-verify-otp-btn').addEventListener('click', async()=>{
    try {
        const email = forgotEmailInput.value;
        const otp = otpInput.value;
        await axios.post(`${url}/api/v1/auth/forgotPassword`, {email, otp});

        stepOtp.classList.add('make-invisible');
        stepReset.classList.remove('make-invisible');
    } catch(err) {
        forgotErrorMsgContainer.textContent = err.response?.data?.msg || 'something went wrong!';
        setTimeout(() => {
            forgotErrorMsgContainer.textContent = "";
        }, 3000);
    }
});


document.querySelector('.js-reset-password-btn').addEventListener('click', async()=>{
    try {
        const email = forgotEmailInput.value;
        const newPassword = newPasswordInput.value;
        const newConfirmPassword = newConfirmPasswordInput.value;
        if(newPassword !== newConfirmPassword) {
            forgotErrorMsgContainer.textContent = "Please make sure that both passwords are same";
            newPasswordInput.value = "";
            newConfirmPasswordInput.value = "";
            setTimeout(() => {
                forgotErrorMsgContainer.textContent = "";
            }, 3000);
            return;
        }
        const res = await axios.patch(`${url}/api/v1/auth/forgotPassword`, {email, newPassword});

        alert(res.data.msg);
        forgotOverlay.classList.add('make-invisible');

        // reset back to first step
        stepReset.classList.add('make-invisible');
        forgotEmailInput.value = "";
        otpInput.value = "";
        newPasswordInput.value = "";
        newConfirmPasswordInput.value = "";
        forgotOverlay.style.display = "none";
    } catch(err) {
        forgotErrorMsgContainer.textContent = err.response?.data?.msg || 'something went wrong!';
        setTimeout(() => {
            forgotErrorMsgContainer.textContent = "";
        }, 3000);
    }
});