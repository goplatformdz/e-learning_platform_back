const nodemailer = require('nodemailer');


const sendMail = async (options) => {

    try {
        const transporter = nodemailer.createTransport({

            service: 'Gmail',
            auth: {
                user: 'managerplatfrome@gmail.com',
                pass: process.env.PASSWORD_ADMIN,
            },
        });

        const mailOptions = {
            from: 'managerplatfrome@gmail.com',
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        next(new CustomError('An error occurred while sending the confirmation email', 500));
    }
}

module.exports = { sendMail }