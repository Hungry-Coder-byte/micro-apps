import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url, origin, method } = await req.json()

  if (!url) {
    return NextResponse.json({ ok: false, error: 'url is required' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      method: method || 'OPTIONS',
      headers: {
        'Origin': origin || req.headers.get('origin') || 'http://localhost:3000',
        'Access-Control-Request-Method': method || 'GET',
      },
      signal: AbortSignal.timeout(10000),
    })

    const corsHeaders: Record<string, string> = {}
    const relevant = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-allow-credentials',
      'access-control-max-age',
    ]

    res.headers.forEach((v, k) => {
      if (relevant.includes(k.toLowerCase())) {
        corsHeaders[k] = v
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        url,
        status: res.status,
        corsHeaders,
        allowed: !!corsHeaders['access-control-allow-origin'],
      }
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 400 }
    )
  }
}
