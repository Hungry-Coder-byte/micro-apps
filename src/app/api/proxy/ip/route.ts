import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  let ip = req.nextUrl.searchParams.get('ip')

  if (!ip || ip === 'me') {
    ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
         req.headers.get('x-real-ip') ??
         'unknown'
  }

  try {
    const res = await fetch(
      `https://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
      { next: { revalidate: 3600 } }
    )

    const d = await res.json()

    if (d.status === 'fail') {
      return NextResponse.json(
        { ok: false, error: d.message ?? 'IP lookup failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, data: d })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}
