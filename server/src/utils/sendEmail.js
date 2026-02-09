
import mailer from "../config/mailer.js";

export const sendOtpEmail = async (email, otp) => {
  try {
    await mailer.sendMail({
      from: `"InstantFix Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your InstantFix Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset OTP</h2>
          <p>Hello,</p>
          <p>Your OTP for resetting your password is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for <strong>5 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
          <br/>
          <p>— InstantFix Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("OTP email sending failed:", error);
    throw error;
  }
};

export const sendRequestAcceptedMail = async (to, requestId) => {
  await mailer.sendMail({
    from: `"InstantFix" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your service request is accepted",
    html: `
      <h3>Good news 🎉</h3>
      <p>Your service request <b>${requestId}</b> has been accepted.</p>
      <p>Our electrician will contact you shortly.</p>
    `,
  });
};