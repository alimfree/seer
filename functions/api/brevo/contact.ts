import { type Env, EMAIL_REGEX, escapeHtml, verifyTurnstile, addToBrevoList, sendBrevoEmail } from '../../lib/shared'

function buildContactConfirmationEmail(firstname: string): string {
  const greeting = firstname ? `, ${firstname}` : ''
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We received your message — Seer Mobility</title>
  <!--[if mso]>
  <style>table,td{font-family:Arial,sans-serif !important;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F8F9FF;font-family:Georgia,'Times New Roman',serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F9FF;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:24px;">
                    <a href="https://www.seermobility.com" style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:300;color:#000B13;letter-spacing:-0.5px;text-decoration:none;">Seer Mobility</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style="width:48px;height:2px;background-color:#4B3111;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:4px;">
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:300;color:#000B13;margin:0 0 20px 0;line-height:1.3;">Thanks for reaching out${greeting}.</h1>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#42474c;margin:0 0 16px 0;line-height:1.6;">We received your message and will get back to you within 24 hours.</p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#42474c;margin:0;line-height:1.6;">If you'd like to skip the back-and-forth, you can book a time directly.</p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td style="background:linear-gradient(135deg,#000B13,#002434);padding:40px;border-radius:4px;text-align:center;">
              <p style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:300;color:#F8F9FF;margin:0 0 8px 0;">Want to talk sooner?</p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8A9BB5;margin:0 0 24px 0;">15-minute discovery call. No pressure, no pitch deck.</p>
              <a href="https://seermobility.com/#contact" style="display:inline-block;background-color:#4B3111;color:#F8F9FF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:2px;">Schedule a Call</a>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;border-top:1px solid #EFF4FF;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:300;color:#000B13;margin:0 0 8px 0;">Seer Mobility</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0 0 4px 0;">NEMT Billing & Revenue Cycle Management</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#72787c;margin:0;">
                      <a href="https://www.seermobility.com" style="color:#6B4A1F;text-decoration:underline;">seermobility.com</a>
                      &nbsp;&middot;&nbsp;
                      <a href="mailto:hello@seermobility.com" style="color:#6B4A1F;text-decoration:underline;">hello@seermobility.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

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

  const firstname = escapeHtml(String(attributes?.FIRSTNAME || ''))
  const lastname = escapeHtml(String(attributes?.LASTNAME || ''))
  const practice = escapeHtml(String(attributes?.PRACTICE || ''))
  const message = escapeHtml(String(attributes?.MESSAGE || ''))
  const fullName = [firstname, lastname].filter(Boolean).join(' ') || 'Unknown'

  // Notify team
  await sendBrevoEmail(env, {
    sender: { name: 'Seer Mobility', email: 'hello@seermobility.com' },
    to: [{ email: 'sales@seermobility.com' }],
    subject: `New contact: ${fullName}${practice ? ` — ${practice}` : ''}`,
    htmlContent: `<p>New contact from ${fullName} (<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>)${practice ? `, ${practice}` : ''}</p>${message ? `<p>Message: ${message}</p>` : ''}`,
    replyTo: { email, name: fullName },
  })

  // Confirmation to the user
  await sendBrevoEmail(env, {
    sender: { name: 'Seer Mobility', email: 'hello@seermobility.com' },
    to: [{ email }],
    subject: 'We received your message — Seer Mobility',
    htmlContent: buildContactConfirmationEmail(firstname),
  })

  return Response.json({ success: true })
}
