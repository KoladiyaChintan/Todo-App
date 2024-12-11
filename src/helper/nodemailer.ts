import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const sendReminderEmail = (email: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: subject,
    text: text,
  };
  console.log("🚀 ~ sendReminderEmail ~ mailOptions:", mailOptions)

  return transporter.sendMail(mailOptions);
};

export { sendReminderEmail };
