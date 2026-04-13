import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { endpoint, query, variables, headers: userHeaders } = await req.json()

  if (!endpoint || !query) {
    return NextResponse.json(
      { ok: false, error: 'endpoint and query are required' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...userHeaders,
      },
      body: JSON.stringify({
        query,
        variables: variables || {},
      }),
      signal: AbortSignal.timeout(30000),
    })

    const data = await res.json()

    return NextResponse.json({
      ok: true,
      data: {
        status: res.status,
        data,
      }
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 400 }
    )
  }
}
