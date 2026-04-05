import { type Env, EMAIL_REGEX, escapeHtml, verifyTurnstile, addToBrevoList, sendBrevoEmail } from '../../lib/shared'
import { buildCalculatorEmail, calculateRevenue } from '../../lib/calculator-email'
import { SAMPLE_SUPERBILL_BASE64 } from '../../lib/sample-superbill'

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

  const patients = Number(attributes?.Patients || attributes?.PATIENTS) || 0
  const hours = Number(attributes?.Hours || attributes?.HOURS) || 0

  if (patients > 0) {
    const html = buildCalculatorEmail({ patients, hours, email })

    await sendBrevoEmail(env, {
      sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
      to: [{ email }],
      subject: 'Your RPM Revenue Analysis — Zayd Health',
      htmlContent: html,
      attachment: [{
        content: SAMPLE_SUPERBILL_BASE64,
        name: 'Zayd-Health-Sample-Superbill.pdf',
      }],
    })

    // Notify team
    const r = calculateRevenue({ patients, hours, email })
    const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })

    await sendBrevoEmail(env, {
      sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
      to: [{ email: 'sales@zaydhealth.com' }],
      subject: `New calculator lead: ${escapeHtml(email)} — ${patients} patients`,
      htmlContent: `<p>New calculator lead: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><p>Patients: ${patients}, Hours: ${hours || '—'}</p><p>RPM First Year: ${fmt(r.rpmFirstYear)}, Stacked: ${fmt(r.stackedFirstYear)}</p>`,
      replyTo: { email },
    })
  }

  return Response.json({ success: true })
}
