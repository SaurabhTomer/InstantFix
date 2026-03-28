import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})

export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"InstantFix" <${process.env.EMAIL}>`,
    to,
    subject: 'InstantFix — Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: #2563eb; padding: 24px; text-align: center;">
          <h1 style="color: #facc15; margin: 0; font-size: 22px; letter-spacing: 1px;">
            ⚡ InstantFix
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 8px 0;">
            Password Reset Request
          </h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px 0;">
            Use the OTP below to reset your password. This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <!-- OTP Box -->
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
              Your OTP
            </p>
            <h1 style="color: #2563eb; font-size: 36px; margin: 0; letter-spacing: 12px; font-weight: 700;">
              ${otp}
            </h1>
          </div>

          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            If you did not request a password reset, please ignore this email. Your account is safe.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px 24px; text-align: center;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            &copy; 2024 InstantFix. All rights reserved.
          </p>
        </div>

      </div>
    `
  })
}

export default transporter