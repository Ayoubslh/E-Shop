const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const AppError = require('./appError');
dotenv.config({ path:'./../congif.env' });

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USERNAME,  
            pass: process.env.EMAIL_PASSWORD,  
        },
        secure: true,  
    });

    const mailOptions = {
        from: `"Galaxy Client Support" <${process.env.EMAIL_USERNAME}>`,  
        to: options.email,  
        subject: options.subject,  
        text: options.message,  
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        throw new AppError(`There was an error sending the email. Try again later!${ error }`, 500);
    }
};

module.exports = sendEmail;
