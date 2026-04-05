import { buildCalculatorEmail, calculateRevenue } from '../../lib/calculator-email'
import { SAMPLE_SUPERBILL_BASE64 } from '../../lib/sample-superbill'

interface Env {
  BREVO_API_KEY: string
  TURNSTILE_SECRET_KEY: string
  BREVO_LIST_CALCULATOR: string
  BREVO_LIST_NEWSLETTER: string
  BREVO_LIST_CONTACT: string
}

const LIST_NAMES = ['calculator', 'newsletter', 'contact'] as const
type ListName = (typeof LIST_NAMES)[number]

function getListId(env: Env, list: ListName): number {
  const map: Record<ListName, string> = {
    calculator: env.BREVO_LIST_CALCULATOR,
    newsletter: env.BREVO_LIST_NEWSLETTER,
    contact: env.BREVO_LIST_CONTACT,
  }
  return Number(map[list])
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context

  let body: { email?: string; list?: string; attributes?: Record<string, unknown>; captchaToken?: string }

  try {
    body = await context.request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, list, attributes, captchaToken } = body

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Missing email' }, { status: 400 })
  }

  if (!list || !LIST_NAMES.includes(list as ListName)) {
    return Response.json({ error: 'Invalid list' }, { status: 400 })
  }

  // Verify Turnstile captcha
  if (captchaToken) {
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${env.TURNSTILE_SECRET_KEY}&response=${captchaToken}`,
    })
    const turnstileData = await turnstileRes.json() as { success: boolean }
    if (!turnstileData.success) {
      return Response.json({ error: 'Captcha verification failed' }, { status: 403 })
    }
  }

  const listId = getListId(env, list as ListName)

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      attributes: attributes || {},
      updateEnabled: true,
    }),
  })

  if (!res.ok) {
    const error = (await res.json().catch(() => ({}))) as { code?: string; message?: string }
    if (error.code !== 'duplicate_parameter') {
      return Response.json({ error: error.message || 'Failed to add contact' }, { status: res.status })
    }
  }

  // Send calculator results email
  if (list === 'calculator' && attributes) {
    const patients = Number(attributes.Patients || attributes.PATIENTS) || 0
    const hours = Number(attributes.Hours || attributes.HOURS) || 0

    if (patients > 0) {
      const html = buildCalculatorEmail({ patients, hours, email })

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
          to: [{ email }],
          subject: 'Your RPM Revenue Analysis — Zayd Health',
          htmlContent: html,
          attachment: [{
            content: SAMPLE_SUPERBILL_BASE64,
            name: 'Zayd-Health-Sample-Superbill.pdf',
          }],
        }),
      })

      // Send notification to team with lead details
      const r = calculateRevenue({ patients, hours, email })
      const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
          to: [{ email: 'sales@zaydhealth.com' }],
          subject: `New calculator lead: ${email} — ${patients} patients`,
          htmlContent: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#F8F9FF;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F9FF;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:300;color:#000B13;letter-spacing:-0.5px;">Zayd Health</span>
              <div style="width:48px;height:2px;background-color:#4B3111;margin-top:24px;"></div>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background:linear-gradient(135deg,#000B13,#002434);padding:36px 40px;border-radius:4px;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#6B8FA8;margin:0 0 12px 0;">New Calculator Lead</p>
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:300;color:#F8F9FF;margin:0 0 8px 0;line-height:1.3;">
                ${patients} patients &middot; ${hours || '—'} hrs/wk
              </h1>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8A9BB5;margin:0;">
                <a href="mailto:${email}" style="color:#D4A96A;text-decoration:underline;">${email}</a>
              </p>
            </td>
          </tr>

          <tr><td style="height:24px;"></td></tr>

          <!-- Revenue Summary -->
          <tr>
            <td style="background-color:#FFFFFF;padding:32px 40px;border-radius:4px;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6B8FA8;margin:0 0 20px 0;">Revenue Projection Sent</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:10px 0;border-bottom:1px solid #EFF4FF;">RPM Only (first year)</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#000B13;font-weight:600;padding:10px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.rpmFirstYear)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;padding:10px 0;border-bottom:1px solid #EFF4FF;">RPM + CCM Stacked (first year)</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6B4A1F;font-weight:600;padding:10px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.stackedFirstYear)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;padding:10px 0;border-bottom:1px solid #EFF4FF;">Monthly per patient (RPM)</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#000B13;padding:10px 0;border-bottom:1px solid #EFF4FF;">${fmt(r.rpmMonthlyPerPatient)}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;padding:10px 0;">Monthly per patient (stacked)</td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#000B13;padding:10px 0;">${fmt(r.stackedMonthlyPerPatient)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0;">
                Reply directly to reach <a href="mailto:${email}" style="color:#6B4A1F;text-decoration:underline;">${email}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
          replyTo: { email },
        }),
      })
    }
  }

  // Send contact form notification to team
  if (list === 'contact' && attributes) {
    const firstname = attributes.Firstname || attributes.FIRSTNAME || ''
    const lastname = attributes.Lastname || attributes.LASTNAME || ''
    const practice = attributes.Practice || attributes.PRACTICE || ''
    const message = attributes.Message || attributes.MESSAGE || ''
    const fullName = [firstname, lastname].filter(Boolean).join(' ') || 'Unknown'

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
        to: [{ email: 'sales@zaydhealth.com' }],
        subject: `New contact: ${fullName}${practice ? ` — ${practice}` : ''}`,
        htmlContent: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#F8F9FF;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F9FF;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="padding:0 0 32px 0;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:300;color:#000B13;letter-spacing:-0.5px;">Zayd Health</span>
              <div style="width:48px;height:2px;background-color:#4B3111;margin-top:24px;"></div>
            </td>
          </tr>

          <tr>
            <td style="background:linear-gradient(135deg,#000B13,#002434);padding:36px 40px;border-radius:4px;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#6B8FA8;margin:0 0 12px 0;">New Contact</p>
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:300;color:#F8F9FF;margin:0 0 8px 0;line-height:1.3;">
                ${fullName}
              </h1>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8A9BB5;margin:0;">
                <a href="mailto:${email}" style="color:#D4A96A;text-decoration:underline;">${email}</a>${practice ? ` &middot; ${practice}` : ''}
              </p>
            </td>
          </tr>

          <tr><td style="height:24px;"></td></tr>

          ${message ? `<tr>
            <td style="background-color:#FFFFFF;padding:32px 40px;border-radius:4px;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6B8FA8;margin:0 0 16px 0;">Message</p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#42474c;line-height:1.7;margin:0;">${message}</p>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:24px 0 0 0;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0;">
                Reply directly to reach <a href="mailto:${email}" style="color:#6B4A1F;text-decoration:underline;">${firstname || 'the contact'}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        replyTo: { email, name: fullName },
      }),
    })

    // Send confirmation to the person who filled out the form
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
        to: [{ email }],
        subject: 'We received your message — Zayd Health',
        htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We received your message — Zayd Health</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F9FF;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F9FF;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <a href="https://www.zaydhealth.com" style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:300;color:#000B13;letter-spacing:-0.5px;text-decoration:none;">Zayd Health</a>
              <div style="width:48px;height:2px;background-color:#4B3111;margin-top:24px;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:4px;">
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:300;color:#000B13;margin:0 0 16px 0;">
                Thanks for reaching out${firstname ? `, ${firstname}` : ''}.
              </h1>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#42474c;line-height:1.7;margin:0 0 24px 0;">
                We received your message and will get back to you within 24 hours. If you'd like to schedule a call sooner, you can book a time directly below.
              </p>
              <a href="https://calendly.com/ali-zaydhealth/discovery" style="display:inline-block;background-color:#002434;color:#F8F9FF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:2px;">Schedule a Call</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;">
              <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:300;color:#000B13;margin:0 0 8px 0;">Zayd Health</p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0 0 4px 0;">RPM Billing Compliance Platform</p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0;">
                <a href="https://www.zaydhealth.com" style="color:#6B4A1F;text-decoration:underline;">zaydhealth.com</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:hello@zaydhealth.com" style="color:#6B4A1F;text-decoration:underline;">hello@zaydhealth.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      }),
    })
  }

  return Response.json({ success: true })
}
