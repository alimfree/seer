import { type Env, escapeHtml, verifyTurnstile, sendBrevoEmail, addToBrevoListBySms, addToBrevoListByLandline } from '../lib/shared'

// Normalizes to E.164 for Brevo's SMS/LANDLINE_NUMBER identifier fields.
// Assumes a US number when no country code is given, matching the site's
// TX/MN target market.
function toE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (raw.trim().startsWith('+')) return `+${digits}`
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context

  let body: { name?: string; phone?: string; company?: string; lineType?: string; captchaToken?: string }
  try {
    body = await context.request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, phone, company, lineType, captchaToken } = body
  const isLandline = lineType === 'landline'

  if (!name || typeof name !== 'string' || !phone || typeof phone !== 'string') {
    return Response.json({ error: 'Name and phone number are required' }, { status: 400 })
  }

  const e164Phone = toE164(phone)
  if (!e164Phone) {
    return Response.json({ error: 'Enter a valid phone number' }, { status: 400 })
  }

  if (captchaToken) {
    const valid = await verifyTurnstile(env, captchaToken)
    if (!valid) return Response.json({ error: 'Captcha verification failed' }, { status: 403 })
  }

  const attributes = {
    FIRSTNAME: name,
    PRACTICE: company || undefined,
    SOURCE: 'call_request',
  }
  const errorRes = isLandline
    ? await addToBrevoListByLandline(env, e164Phone, Number(env.BREVO_LIST_CALL_REQUEST), attributes)
    : await addToBrevoListBySms(env, e164Phone, Number(env.BREVO_LIST_CALL_REQUEST), attributes)
  if (errorRes) return errorRes

  const safeName = escapeHtml(name)
  const safePhone = escapeHtml(phone)
  const safeCompany = escapeHtml(company || '')

  await sendBrevoEmail(env, {
    sender: { name: 'Seer Mobility', email: 'hello@seermobility.com' },
    to: [{ email: 'sales@seermobility.com' }],
    subject: `New live call request: ${safeName}${safeCompany ? ` — ${safeCompany}` : ''}`,
    htmlContent: `<p>New live call request from <strong>${safeName}</strong> at <strong>${safePhone}</strong>${safeCompany ? `, ${safeCompany}` : ''}.${isLandline ? ' <em>(Office/landline — can\'t receive a text confirmation.)</em>' : ''}</p>`,
  })

  return Response.json({ success: true })
}
