import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory webhook storage for demo
const webhooks: Map<string, { url: string; payloads: unknown[] }> = new Map()

export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action')

  if (action === 'create') {
    const id = crypto.randomUUID()
    webhooks.set(id, { url: `/api/proxy/webhook/${id}`, payloads: [] })
    return NextResponse.json({
      ok: true,
      data: {
        id,
        url: `${req.nextUrl.origin}/api/proxy/webhook/${id}`,
      }
    })
  }

  if (action === 'poll') {
    const id = req.nextUrl.searchParams.get('id')
    if (!id || !webhooks.has(id)) {
      return NextResponse.json({ ok: false, error: 'Webhook not found' }, { status: 404 })
    }
    const webhook = webhooks.get(id)!
    const newPayloads = webhook.payloads.splice(0)
    return NextResponse.json({
      ok: true,
      data: { payloads: newPayloads }
    })
  }

  return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 })
}
