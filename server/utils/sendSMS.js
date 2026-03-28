import twilio from 'twilio'

const sendSMS = async (to, message) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to
  })
}

export default sendSMS