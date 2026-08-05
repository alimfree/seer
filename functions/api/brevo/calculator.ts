import { type Env, EMAIL_REGEX, escapeHtml, verifyTurnstile, addToBrevoList, sendBrevoEmail } from '../../lib/shared'
import { buildCalculatorEmail, calculateRevenue } from '../../lib/calculator-email'

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

  const errorRes = await addToBrevoList(env, email, Number(env.BREVO_LIST_CALCULATOR), attributes)
  if (errorRes) return errorRes

  const trips = Number(attributes?.Trips || attributes?.TRIPS) || 0
  const reimbursement = Number(attributes?.Reimbursement || attributes?.REIMBURSEMENT) || 0
  const denialRate = Number(attributes?.DenialRate || attributes?.DENIALRATE) || undefined

  if (trips > 0 && reimbursement > 0) {
    const html = buildCalculatorEmail({ trips, reimbursement, denialRate, email })

    await sendBrevoEmail(env, {
      sender: { name: 'Seer Mobility', email: 'hello@seermobility.com' },
      to: [{ email }],
      subject: 'Your NEMT Revenue Recovery Analysis — Seer Mobility',
      htmlContent: html,
    })

    // Notify team
    const r = calculateRevenue({ trips, reimbursement, denialRate, email })
    const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })

    await sendBrevoEmail(env, {
      sender: { name: 'Seer Mobility', email: 'hello@seermobility.com' },
      to: [{ email: 'sales@seermobility.com' }],
      subject: `New calculator lead: ${escapeHtml(email)} — ${trips} trips/mo`,
      htmlContent: `<p>New calculator lead: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><p>Trips/mo: ${trips}, Reimbursement/trip: ${fmt(reimbursement)}, Denial rate: ${r.denialRate}%</p><p>Annual lost to denials: ${fmt(r.annualLostToDenials)}, Annual recoverable: ${fmt(r.annualRecoverable)}</p>`,
      replyTo: { email },
    })
  }

  return Response.json({ success: true })
}
