const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"AI Jobmate" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: "Verify Your Email – AI Jobmate OTP Code",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
            
            <h2 style="margin-bottom: 10px;">Welcome to AI Jobmate 🚀</h2>
            
            <p style="font-size: 14px; color: #475569;">
                Use the verification code below to complete your registration:
            </p>

            <div style="
                margin: 30px 0;
                text-align: center;
            ">
                <span style="
                    display: inline-block;
                    padding: 15px 30px;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    background: #6366f1;
                    color: white;
                    border-radius: 8px;
                ">
                    ${options.otp}
                </span>
            </div>

            <p style="font-size: 13px; color: #64748b;">
                This OTP will expire in 5 minutes.
            </p>

            <p style="font-size: 13px; color: #94a3b8;">
                If you did not request this, please ignore this email.
            </p>

            <hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;" />

            <p style="font-size: 12px; color: #94a3b8;">
                AI Jobmate – Intelligent Career Companion
            </p>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;