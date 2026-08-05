type ListName = 'calculator' | 'newsletter' | 'contact'

interface ContactAttributes {
  Firstname?: string
  Lastname?: string
  Practice?: string
  Message?: string
  Trips?: number
  Reimbursement?: number
  DenialRate?: number
  Source?: string
}

export class RateLimitError extends Error {
  constructor() {
    super('Too many requests. Please wait a moment and try again.')
    this.name = 'RateLimitError'
  }
}

const ENDPOINT_MAP: Record<ListName, string> = {
  calculator: '/api/brevo/calculator',
  newsletter: '/api/brevo/newsletter',
  contact: '/api/brevo/contact',
}

export async function addContact(
  email: string,
  list: ListName,
  attributes?: ContactAttributes,
  captchaToken?: string
): Promise<void> {
  const res = await fetch(ENDPOINT_MAP[list], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, attributes, captchaToken }),
  })

  if (res.status === 429) {
    throw new RateLimitError()
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error((error as { error?: string }).error || 'Failed to add contact')
  }
}
