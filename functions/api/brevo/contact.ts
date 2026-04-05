import { type Env, EMAIL_REGEX, escapeHtml, verifyTurnstile, addToBrevoList, sendBrevoEmail } from '../../lib/shared'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context

  let body: { email?: string; attributes?: Record<string, unknown>; captchaToken?: string }
  try {
    body = await context.request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, attributes, captchaToken } = body

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  if (captchaToken) {
    const valid = await verifyTurnstile(env, captchaToken)
    if (!valid) return Response.json({ error: 'Captcha verification failed' }, { status: 403 })
  }

  const errorRes = await addToBrevoList(env, email, Number(env.BREVO_LIST_CONTACT), attributes)
  if (errorRes) return errorRes

  const firstname = escapeHtml(String(attributes?.Firstname || attributes?.FIRSTNAME || ''))
  const lastname = escapeHtml(String(attributes?.Lastname || attributes?.LASTNAME || ''))
  const practice = escapeHtml(String(attributes?.Practice || attributes?.PRACTICE || ''))
  const message = escapeHtml(String(attributes?.Message || attributes?.MESSAGE || ''))
  const fullName = [firstname, lastname].filter(Boolean).join(' ') || 'Unknown'

  // Notify team
  await sendBrevoEmail(env, {
    sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
    to: [{ email: 'sales@zaydhealth.com' }],
    subject: `New contact: ${fullName}${practice ? ` — ${practice}` : ''}`,
    htmlContent: `<p>New contact from ${fullName} (<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>)${practice ? `, ${practice}` : ''}</p>${message ? `<p>Message: ${message}</p>` : ''}`,
    replyTo: { email, name: fullName },
  })

  // Confirmation to the user
  await sendBrevoEmail(env, {
    sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
    to: [{ email }],
    subject: 'We received your message — Zayd Health',
    htmlContent: `<p>Thanks for reaching out${firstname ? `, ${firstname}` : ''}. We received your message and will get back to you within 24 hours.</p><p><a href="https://calendly.com/ali-zaydhealth/discovery">Schedule a Call</a></p>`,
  })

  return Response.json({ success: true })
}
