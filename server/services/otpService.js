const crypto = require("crypto");
const nodemailer = require("nodemailer")
const MailGen = require("mailgen");
const hashService = require("./hashService");

const config = {
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
    }
}
const transporter = nodemailer.createTransport(config);
const MailGenerator = new MailGen({
    theme: "default",
    product: {
        name: "JamPod",
        "link": "https://amritraj.vercel.app",
        logo: 'https://res.cloudinary.com/diwh62559/image/upload/v1703068058/logo-no-background_fm0ig4.png'
    }
})


class OtpService {
    generateOtp = async () => {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    sendByEmail = async (email, otp) => {

        const emailTemp = {
            body: {
                name: '',
                intro: 'Welcome to JamPod! We\'re very excited to have you on board.',
                action: {
                    instructions: 'To verify your account, please use the following OTP:',
                    button: {
                        color: '#323232', // Optional action button color
                        text: otp,
                        link: '#'
                    }
                },
                outro: 'This OTP will expire in a short time (2 mins) for security reasons. If you did not request this OTP, please ignore this email.'
            }
        };
        
        const mail = MailGenerator.generate(emailTemp);

        let message = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Email Verification OTP | JamPod",
            html: mail
        }

        const info = await transporter.sendMail(message);
        return info.messageId;

    }

    verifyOtp = async (hashedOTP, data) => {
        let computedHash = await hashService.hashOtp(data);
        return computedHash === hashedOTP ? true : false;
    }
}


module.exports = new OtpService();