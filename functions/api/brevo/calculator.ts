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

  const missedCallsPerWeek = Number(attributes?.MISSED_CALLS_WEEK) || 0
  const avgTripValue = Number(attributes?.AVG_TRIP_VALUE) || 0
  const fleetSize = Number(attributes?.FLEET_SIZE) || undefined

  if (missedCallsPerWeek > 0 && avgTripValue > 0) {
    const html = buildCalculatorEmail({ missedCallsPerWeek, avgTripValue, fleetSize, email })

    await sendBrevoEmail(env, {
      sender: { name: 'Seer Mobility', email: 'hello@seermobility.com' },
      to: [{ email }],
      subject: 'Your Missed-Call Revenue Analysis — Seer Mobility',
      htmlContent: html,
    })

    // Notify team
    const r = calculateRevenue({ missedCallsPerWeek, avgTripValue, fleetSize, email })
    const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })

    await sendBrevoEmail(env, {
      sender: { name: 'Seer Mobility', email: 'hello@seermobility.com' },
      to: [{ email: 'sales@seermobility.com' }],
      subject: `New calculator lead: ${escapeHtml(email)} — ${missedCallsPerWeek} missed calls/wk`,
      htmlContent: `<p>New calculator lead: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><p>Missed calls/wk: ${missedCallsPerWeek}, Avg trip value: ${fmt(avgTripValue)}, Fleet size: ${fleetSize ?? 'n/a'}</p><p>Monthly recoverable: ${fmt(r.monthlyRecoverable)}, Annual recoverable: ${fmt(r.annualRecoverable)}</p>`,
      replyTo: { email },
    })
  }

  return Response.json({ success: true })
}
