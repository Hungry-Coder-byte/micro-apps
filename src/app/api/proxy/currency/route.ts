import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get('from') ?? 'USD'
  const to = req.nextUrl.searchParams.get('to') ?? 'EUR'
  const amount = parseFloat(req.nextUrl.searchParams.get('amount') ?? '1')

  if (!from || !to || isNaN(amount)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid parameters' },
      { status: 400 }
    )
  }

  try {
    // Use free API (no key required)
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, {
      next: { revalidate: 3600 }
    })

    if (!res.ok) {
      throw new Error('Exchange rate service unavailable')
    }

    const d = await res.json()
    const rate = d.rates[to]

    if (!rate) {
      return NextResponse.json(
        { ok: false, error: `Unknown currency: ${to}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: {
        from,
        to,
        rate,
        result: amount * rate,
        amount,
        lastUpdated: d.time_last_update_utc
      }
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}
