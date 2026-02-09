
import mailer from "../config/mailer.js";

export const sendOtpEmail = async (email, otp) => {
  try {
    await mailer.sendMail({
      from: `"InstantFix Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your InstantFix Password Reset OTP 🔐",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2c7be5;">Password Reset Request</h2>

          <p>Hi,</p>

          <p>
            We received a request to reset the password for your
            <b>InstantFix</b> account.
          </p>

          <p>
            Please use the following One-Time Password (OTP) to proceed:
          </p>

          <div style="
            margin: 20px 0;
            padding: 15px;
            background: #f4f6f8;
            border-radius: 6px;
            text-align: center;
          ">
            <h1 style="letter-spacing: 6px; margin: 0;">${otp}</h1>
          </div>

          <p>
            This OTP is valid for <b>5 minutes</b>.  
            For your security, do not share this code with anyone.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email. No changes will be made to your account.
          </p>

          <hr style="margin: 20px 0;" />

          <p style="font-size: 12px; color: #777;">
            This is an automated security email from InstantFix.
          </p>

          <p style="font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} InstantFix. All rights reserved.
          </p>
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
    subject: "Your Service Request Has Been Accepted ✅",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2c7be5;">Good News 🎉</h2>

        <p>Hi,</p>

        <p>
          Your service request has been <b>successfully accepted</b>.
        </p>

        <p>
          <b>Request ID:</b> ${requestId}
        </p>

        <p>
          An electrician has been assigned to your request and will
          contact you shortly.
        </p>

        <p>
          Thank you for choosing <b>InstantFix</b>.  
          We’re here to make things work again ⚡
        </p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 12px; color: #777;">
          This is an automated email. Please do not reply to this message.
        </p>

        <p style="font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} InstantFix. All rights reserved.
        </p>
      </div>
    `,
  });
};


export const sendRequestCompletedMail = async (email, issueType) => {
  await mailer.sendMail({
    to: email,
    subject: "Your Service Has Been Successfully Completed ✅",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2c7be5;">Service Completed 🎉</h2>

        <p>Hi,</p>

        <p>
          We’re happy to inform you that your service request has been
          <b>successfully completed</b>.
        </p>

        <p>
          <b>Service Issue:</b> ${issueType}
        </p>

        <p>
          Thank you for choosing <b>InstantFix</b>.  
          We hope everything is working perfectly now!
        </p>

        <p>
          If you need any further help, feel free to raise a new request anytime.
        </p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 12px; color: #777;">
          This is an automated email. Please do not reply.
        </p>

        <p style="font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} InstantFix. All rights reserved.
        </p>
      </div>
    `,
  });
};
