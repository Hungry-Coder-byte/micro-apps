import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { title, description, category, email } = await req.json()

  if (!title || !description || !category || !email) {
    return NextResponse.json(
      { ok: false, error: 'All fields are required' },
      { status: 400 }
    )
  }

  // In production, this would:
  // 1. Save to database
  // 2. Create Stripe checkout session
  // 3. Return checkout URL

  // For now, just acknowledge
  return NextResponse.json({
    ok: true,
    data: {
      id: crypto.randomUUID(),
      message: 'Request submitted. Typically $9.99 via Stripe would be charged here.',
      title,
      category,
    }
  })
}
