import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  let ip = req.nextUrl.searchParams.get('ip')

  if (!ip) {
    ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? ''
  }

  const token = process.env.IPINFO_TOKEN
  const url = token ? `https://ipinfo.io/${ip}?token=${token}` : `https://ipinfo.io/${ip}/json`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('Geolocation lookup failed')

    const d = await res.json()
    return NextResponse.json({ ok: true, data: d })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 503 }
    )
  }
}
