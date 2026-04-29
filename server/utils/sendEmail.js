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

// ─── Shared layout helpers ─────────────────────────────────────────────────────

const emailWrapper = (body) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
    <div style="background: #2563eb; padding: 24px; text-align: center;">
      <h1 style="color: #facc15; margin: 0; font-size: 22px; letter-spacing: 1px;">⚡ InstantFix</h1>
    </div>
    <div style="padding: 32px 24px;">${body}</div>
    <div style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px 24px; text-align: center;">
      <p style="color: #9ca3af; font-size: 11px; margin: 0;">&copy; 2024 InstantFix. All rights reserved.</p>
    </div>
  </div>`

const badge = (text, color) =>
  `<span style="display:inline-block;background:${color};color:#fff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">${text}</span>`

// ─── Job Accepted ──────────────────────────────────────────────────────────────
export const sendJobAcceptedEmail = async (to, { electricianName, hourlyRate, category }) => {
  await transporter.sendMail({
    from: `"InstantFix" <${process.env.EMAIL}>`,
    to,
    subject: 'InstantFix — Your request has been accepted!',
    html: emailWrapper(`
      <p style="margin:0 0 4px 0;">${badge('Accepted', '#2563eb')}</p>
      <h2 style="color:#1f2937;font-size:18px;margin:16px 0 8px 0;">Great news! Electrician is on the way.</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px 0;">
        Your <strong>${category}</strong> request has been accepted.
      </p>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 6px 0;color:#374151;font-size:14px;"><strong>Electrician:</strong> ${electricianName}</p>
        <p style="margin:0;color:#374151;font-size:14px;"><strong>Hourly Rate:</strong> ₹${hourlyRate}/hr</p>
      </div>
      <p style="color:#9ca3af;font-size:12px;margin:0;">You will be notified when work begins.</p>
    `)
  })
}

// ─── Job Started ───────────────────────────────────────────────────────────────
export const sendJobStartedEmail = async (to, { electricianName, category }) => {
  await transporter.sendMail({
    from: `"InstantFix" <${process.env.EMAIL}>`,
    to,
    subject: 'InstantFix — Work has started!',
    html: emailWrapper(`
      <p style="margin:0 0 4px 0;">${badge('In Progress', '#7c3aed')}</p>
      <h2 style="color:#1f2937;font-size:18px;margin:16px 0 8px 0;">Work has begun on your request.</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px 0;">
        <strong>${electricianName}</strong> has started working on your <strong>${category}</strong> request.
        The timer is now running.
      </p>
      <p style="color:#9ca3af;font-size:12px;margin:0;">You will receive an invoice once the job is complete.</p>
    `)
  })
}

// ─── Job Completed ─────────────────────────────────────────────────────────────
export const sendJobCompletedEmail = async (to, { totalAmount, category, billedHours, hourlyRate }) => {
  await transporter.sendMail({
    from: `"InstantFix" <${process.env.EMAIL}>`,
    to,
    subject: `InstantFix — Job complete. Amount due: ₹${totalAmount}`,
    html: emailWrapper(`
      <p style="margin:0 0 4px 0;">${badge('Completed', '#059669')}</p>
      <h2 style="color:#1f2937;font-size:18px;margin:16px 0 8px 0;">Your job is done!</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px 0;">
        The <strong>${category}</strong> request has been completed. Here's your bill:
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 6px 0;color:#374151;font-size:14px;"><strong>Billed Hours:</strong> ${billedHours} hr(s)</p>
        <p style="margin:0 0 6px 0;color:#374151;font-size:14px;"><strong>Rate:</strong> ₹${hourlyRate}/hr</p>
        <p style="margin:0;color:#059669;font-size:18px;font-weight:700;"><strong>Total: ₹${totalAmount}</strong></p>
      </div>
      <p style="color:#9ca3af;font-size:12px;margin:0;">Please open the app to complete payment online or pay cash to the electrician.</p>
    `)
  })
}

// ─── Payment Success (to customer) ────────────────────────────────────────────
export const sendPaymentSuccessEmail = async (to, { amount, category, method }) => {
  await transporter.sendMail({
    from: `"InstantFix" <${process.env.EMAIL}>`,
    to,
    subject: 'InstantFix — Payment confirmed!',
    html: emailWrapper(`
      <p style="margin:0 0 4px 0;">${badge('Paid', '#059669')}</p>
      <h2 style="color:#1f2937;font-size:18px;margin:16px 0 8px 0;">Payment received. Thank you!</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px 0;">
        Your payment for <strong>${category}</strong> has been confirmed.
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 6px 0;color:#374151;font-size:14px;"><strong>Amount Paid:</strong> ₹${amount}</p>
        <p style="margin:0;color:#374151;font-size:14px;"><strong>Method:</strong> ${method === 'cash' ? 'Cash' : 'Online (Razorpay)'}</p>
      </div>
      <p style="color:#9ca3af;font-size:12px;margin:0;">Don't forget to leave a review for your electrician in the app!</p>
    `)
  })
}

// ─── Payment Received (to electrician) ────────────────────────────────────────
export const sendPaymentReceivedEmail = async (to, { amount, category, method }) => {
  await transporter.sendMail({
    from: `"InstantFix" <${process.env.EMAIL}>`,
    to,
    subject: `InstantFix — Payment of ₹${amount} received!`,
    html: emailWrapper(`
      <p style="margin:0 0 4px 0;">${badge('Payment Received', '#2563eb')}</p>
      <h2 style="color:#1f2937;font-size:18px;margin:16px 0 8px 0;">You've been paid!</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px 0;">
        Payment for the <strong>${category}</strong> job has been confirmed.
      </p>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 6px 0;color:#374151;font-size:14px;"><strong>Amount:</strong> ₹${amount}</p>
        <p style="margin:0;color:#374151;font-size:14px;"><strong>Method:</strong> ${method === 'cash' ? 'Cash' : 'Online (Razorpay)'}</p>
      </div>
      <p style="color:#9ca3af;font-size:12px;margin:0;">Thank you for using InstantFix. Keep up the great work!</p>
    `)
  })
}

export default transporter