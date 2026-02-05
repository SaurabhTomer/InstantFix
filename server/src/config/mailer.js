import dotenv from 'dotenv'
dotenv.config();
import nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, 
  secure: true ,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // ✅ Make sure this matches your .env
  },
});


// Optional but recommended (checks SMTP connection on startup)
mailer.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer connection failed:", error);
  } else {
    console.log("✅ Mailer is ready to send emails");
  }
});

export default mailer;