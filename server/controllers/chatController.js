import groq from '../config/groq.js'
import ServiceRequest from '../models/ServiceRequest.js'

const SYSTEM_PROMPT = `
You are FixBot, an intelligent assistant for InstantFix — an on-demand electrician service app based in India.

You have TWO roles:

1. CUSTOMER SUPPORT
   - Help users understand how to create a service request
   - Explain request statuses: pending, accepted, started, completed, cancelled
   - Guide users on how to cancel, track, or pay for a request
   - Answer questions about reviews, payments (online/cash), and profiles

2. ELECTRICAL DIAGNOSIS
   - When a user describes an electrical problem, ask smart follow-up questions
   - Provide basic safety advice (e.g. turn off MCB, don't touch live wires)
   - Suggest likely causes and whether it needs urgent professional attention
   - Always recommend booking a professional electrician for any real fix
   - Never encourage DIY fixes for high-voltage or panel-level issues

RULES:
- Keep responses concise and friendly
- Use simple language — many users may not be technical
- If unsure, say so and suggest booking an electrician
- Always prioritize user safety above all else
- Respond in the same language the user writes in (Hindi or English)
`.trim()

// POST /api/chat
export const chat = async (req, res) => {
  try {
    const { messages, requestId } = req.body
    const customerId = req.user.id

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' })
    }

    // Optionally inject request context if user is asking about a specific request
    let contextBlock = ''
    if (requestId) {
      const request = await ServiceRequest.findOne({
        _id:      requestId,
        customer: customerId,
      }).populate('electrician', 'name phone')

      if (request) {
        contextBlock = `
[CURRENT REQUEST CONTEXT]
- Category: ${request.category}
- Status: ${request.status}
- Payment: ${request.paymentStatus}
- Description: ${request.description}
- Electrician: ${request.electrician?.name || 'Not assigned yet'}
- Created: ${new Date(request.createdAt).toLocaleDateString('en-IN')}
        `.trim()
      }
    }

    const systemWithContext = contextBlock
      ? `${SYSTEM_PROMPT}\n\n${contextBlock}`
      : SYSTEM_PROMPT

    // Keep last 10 messages to avoid token overflow
    const trimmedMessages = messages.slice(-10).map(m => ({
      role:    m.role,
      content: m.content,
    }))

    const completion = await groq.chat.completions.create({
      model:       "llama-3.1-8b-instant",  // fast + free on Groq
      temperature: 0.7,
      max_tokens:  512,
      messages: [
        { role: 'system', content: systemWithContext },
        ...trimmedMessages,
      ],
    })

    const reply = completion.choices[0]?.message?.content?.trim()
    if (!reply) return res.status(500).json({ message: 'No response from AI' })

    res.json({ reply })

  } catch (err) {
    console.error('chat error:', err)
    res.status(500).json({ message: 'AI service error' })
  }
}