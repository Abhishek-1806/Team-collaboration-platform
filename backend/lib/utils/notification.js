import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendNotification = async (email, subject, message) => {
    try {
        const mailOptions = {
            from: `"Team Collaboration Platform" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            text: message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${info.messageId}`);
        
    } catch (error) {
        console.log("Error sending notification: ", error.message);
    }
};