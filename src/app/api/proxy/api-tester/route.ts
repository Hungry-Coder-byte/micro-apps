import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url, method, headers: userHeaders, body } = await req.json()

  if (!url) {
    return NextResponse.json({ ok: false, error: 'url is required' }, { status: 400 })
  }

  try {
    const reqHeaders: Record<string, string> = {
      'User-Agent': 'MicroApps API Tester',
      ...userHeaders,
    }

    const startTime = Date.now()
    const res = await fetch(url, {
      method: method || 'GET',
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000),
    })
    const duration = Date.now() - startTime

    const contentType = res.headers.get('content-type')
    let responseBody: unknown

    if (contentType?.includes('application/json')) {
      responseBody = await res.json()
    } else {
      responseBody = await res.text()
    }

    const headers: Record<string, string> = {}
    res.headers.forEach((v, k) => { headers[k] = v })

    return NextResponse.json({
      ok: true,
      data: {
        status: res.status,
        statusText: res.statusText,
        headers,
        body: responseBody,
        duration,
      }
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 400 }
    )
  }
}
