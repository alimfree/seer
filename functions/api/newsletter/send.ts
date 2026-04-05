import { buildNewsletterEmail } from '../../lib/newsletter-email'

interface Env {
  BREVO_API_KEY: string
  BREVO_LIST_NEWSLETTER: string
  NEWSLETTER_SECRET: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context

  // Protect endpoint with a secret
  const auth = context.request.headers.get('Authorization')
  if (auth !== `Bearer ${env.NEWSLETTER_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { month?: string; posts?: Array<{ title: string; slug: string; category: string; description: string; readingTime: number }> }

  try {
    body = await context.request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { month, posts } = body

  if (!month || !posts || posts.length === 0) {
    return Response.json({ error: 'Missing month or posts' }, { status: 400 })
  }

  const html = buildNewsletterEmail({ month, posts })

  // Send campaign via Brevo
  // Step 1: Create the campaign
  const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: `Monthly Synthesis — ${month}`,
      subject: `The Monthly Synthesis — ${month}`,
      sender: { name: 'Zayd Health', email: 'hello@zaydhealth.com' },
      recipients: { listIds: [Number(env.BREVO_LIST_NEWSLETTER)] },
      htmlContent: html,
      previewText: `${posts.length} new RPM resource${posts.length !== 1 ? 's' : ''} this month`,
    }),
  })

  if (!createRes.ok) {
    const error = await createRes.json().catch(() => ({}))
    return Response.json({ error: `Failed to create campaign: ${JSON.stringify(error)}` }, { status: createRes.status })
  }

  const campaign = await createRes.json() as { id: number }

  // Step 2: Send the campaign immediately
  const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaign.id}/sendNow`, {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!sendRes.ok) {
    const error = await sendRes.json().catch(() => ({}))
    return Response.json({ error: `Failed to send campaign: ${JSON.stringify(error)}` }, { status: sendRes.status })
  }

  return Response.json({ success: true, campaignId: campaign.id })
}
