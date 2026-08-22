interface NewsletterPost {
  title: string
  slug: string
  category: string
  description: string
  readingTime: number
}

interface NewsletterInput {
  month: string // e.g. "April 2026"
  posts: NewsletterPost[]
}

function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    billing: 'Billing Guide',
    compliance: 'Compliance',
    operations: 'Operations',
  }
  return labels[category] || category
}

export function buildNewsletterEmail(input: NewsletterInput): string {
  const { month, posts } = input

  const postRows = posts.map((post) => `
    <tr>
      <td style="padding:24px 0;border-bottom:1px solid #EFF4FF;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#4B3111;margin:0 0 8px 0;">${categoryLabel(post.category)}</p>
        <a href="https://www.seermobility.com/resources/${post.category}/${post.slug}" style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;color:#000B13;text-decoration:underline;text-underline-offset:3px;line-height:1.4;">${post.title}</a>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#42474c;margin:8px 0 0 0;line-height:1.5;">${post.description}</p>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#6B8FA8;margin:8px 0 0 0;">${post.readingTime} min read</p>
      </td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Monthly Synthesis — ${month}</title>
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

          <!-- Title Block -->
          <tr>
            <td style="padding:0 0 40px 0;">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#6B8FA8;margin:0 0 12px 0;">${month}</p>
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;color:#000B13;margin:0 0 16px 0;line-height:1.3;">The Monthly Synthesis</h1>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#42474c;margin:0;line-height:1.6;">NEMT billing changes, broker portal updates, and what's working in the field.</p>
            </td>
          </tr>

          <!-- Posts -->
          <tr>
            <td style="background-color:#FFFFFF;padding:32px 40px;border-radius:4px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:400;color:#000B13;margin:0 0 8px 0;">This Month's Resources</h2>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#5a5f63;margin:0 0 16px 0;">${posts.length} new guide${posts.length !== 1 ? 's' : ''} published</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${postRows}
              </table>

              <div style="margin-top:24px;text-align:center;">
                <a href="https://www.seermobility.com/resources" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#4B3111;text-decoration:underline;text-underline-offset:3px;">View all resources &rarr;</a>
              </div>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- Live Demo CTA -->
          <tr>
            <td style="background-color:#000B13;background:linear-gradient(135deg,#000B13,#002434);padding:40px;border-radius:4px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:300;color:#F8F9FF;margin:0 0 12px 0;">Curious what a missed call sounds like recovered?</h2>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8A9BB5;margin:0 0 24px 0;line-height:1.5;">Leave your number and we'll set up a live call so you can hear the AI dispatcher for yourself.</p>
              <a href="https://www.seermobility.com/#live-demo" style="display:inline-block;background-color:#4B3111;color:#F8F9FF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:2px;">Request My Live Call</a>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- Discovery Call CTA -->
          <tr>
            <td style="background-color:#FFFFFF;padding:32px 40px;border-radius:4px;text-align:center;">
              <p style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:300;color:#000B13;margin:0 0 8px 0;">Ready to talk?</p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#42474c;margin:0 0 20px 0;">15-minute discovery call. No pressure, no pitch deck.</p>
              <a href="https://seermobility.com/#contact" style="display:inline-block;background-color:#002434;color:#F8F9FF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:2px;">Schedule a Call</a>
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
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5a5f63;margin:0 0 4px 0;">AI Voice Dispatch for NEMT Fleets</p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5a5f63;margin:0 0 12px 0;">
                      <a href="https://www.seermobility.com" style="color:#6B4A1F;text-decoration:underline;">seermobility.com</a>
                      &nbsp;&middot;&nbsp;
                      <a href="mailto:hello@seermobility.com" style="color:#6B4A1F;text-decoration:underline;">hello@seermobility.com</a>
                    </p>
                    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5a5f63;margin:0;">
                      <a href="{{ unsubscribe }}" style="color:#5a5f63;text-decoration:underline;">Unsubscribe</a>
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
