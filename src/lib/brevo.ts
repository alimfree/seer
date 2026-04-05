type ListName = 'calculator' | 'newsletter' | 'contact'

interface ContactAttributes {
  Firstname?: string
  Lastname?: string
  Practice?: string
  Message?: string
  Patients?: number
  Hours?: number
  Source?: string
}

export async function addContact(
  email: string,
  list: ListName,
  attributes?: ContactAttributes,
  captchaToken?: string
): Promise<void> {
  const res = await fetch('/api/brevo/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, list, attributes, captchaToken }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error((error as { error?: string }).error || 'Failed to add contact')
  }
}
