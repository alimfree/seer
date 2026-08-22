import { type Env, escapeHtml, verifyTurnstile, sendBrevoEmail } from '../lib/shared'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context

  let body: { name?: string; phone?: string; company?: string; captchaToken?: string }
  try {
    body = await context.request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, phone, company, captchaToken } = body

  if (!name || typeof name !== 'string' || !phone || typeof phone !== 'string') {
    return Response.json({ error: 'Name and phone number are required' }, { status: 400 })
  }

  if (captchaToken) {
    const valid = await verifyTurnstile(env, captchaToken)
    if (!valid) return Response.json({ error: 'Captcha verification failed' }, { status: 403 })
  }

  const safeName = escapeHtml(name)
  const safePhone = escapeHtml(phone)
  const safeCompany = escapeHtml(company || '')

  await sendBrevoEmail(env, {
    sender: { name: 'Seer Mobility', email: 'hello@seermobility.com' },
    to: [{ email: 'sales@seermobility.com' }],
    subject: `New live call request: ${safeName}${safeCompany ? ` — ${safeCompany}` : ''}`,
    htmlContent: `<p>New live call request from <strong>${safeName}</strong> at <strong>${safePhone}</strong>${safeCompany ? `, ${safeCompany}` : ''}.</p>`,
  })

  return Response.json({ success: true })
}
