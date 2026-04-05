export interface Env {
  BREVO_API_KEY: string
  TURNSTILE_SECRET_KEY: string
  BREVO_LIST_CALCULATOR: string
  BREVO_LIST_NEWSLETTER: string
  BREVO_LIST_CONTACT: string
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function verifyTurnstile(env: Env, token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${env.TURNSTILE_SECRET_KEY}&response=${token}`,
  })
  const data = await res.json() as { success: boolean }
  return data.success
}

export async function addToBrevoList(env: Env, email: string, listId: number, attributes?: Record<string, unknown>): Promise<Response | null> {
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

  return null // success
}

export async function sendBrevoEmail(env: Env, payload: Record<string, unknown>): Promise<void> {
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
