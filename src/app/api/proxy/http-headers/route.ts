import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ ok: false, error: 'url is required' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    })

    const headers: Record<string, string> = {}
    res.headers.forEach((v, k) => {
      headers [k] = v
    })

    return NextResponse.json({
      ok: true,
      data: {
        url,
        status: res.status,
        statusText: res.statusText,
        headers
      }
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 400 }
    )
  }
}
