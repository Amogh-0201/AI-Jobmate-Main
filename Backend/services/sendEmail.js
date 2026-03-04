const axios = require('axios');
require('dotenv').config();

const sendEmail = async (options) => {
    try {
        // Updated URL to the correct Brevo v3 endpoint
        await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: "AI Jobmate", email: process.env.BREVO_USER },
            to: [{ email: options.email }],
            subject: "Verify Your Email – AI Jobmate OTP Code",
            textContent: `Your AI Jobmate verification OTP is ${options.otp}. It expires in 5 minutes.`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
                    <h2>Welcome to AI Jobmate 🚀</h2>
                    <p>Use the verification code below to complete your registration:</p>
                    <div style="margin: 30px 0; text-align: center;">
                        <span style="display: inline-block; padding: 15px 30px; font-size: 32px; font-weight: bold; background: #6366f1; color: white; border-radius: 8px;">
                            ${options.otp}
                        </span>
                    </div>
                    <p>This OTP will expire in 5 minutes.</p>
                </div>
            `
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log("Email sent successfully via Brevo API");
    } catch (error) {
        // Detailed error logging to help you debug on Render
        console.error("Email failed:", error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = sendEmail;