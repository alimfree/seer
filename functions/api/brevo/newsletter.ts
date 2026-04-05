import { type Env, EMAIL_REGEX, addToBrevoList } from '../../lib/shared'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context

  let body: { email?: string; attributes?: Record<string, unknown> }
  try {
    body = await context.request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, attributes } = body

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  const errorRes = await addToBrevoList(env, email, Number(env.BREVO_LIST_NEWSLETTER), attributes)
  if (errorRes) return errorRes

  return Response.json({ success: true })
}
