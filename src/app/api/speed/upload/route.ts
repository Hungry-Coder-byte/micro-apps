import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  // Drain the body to give accurate upload timing
  let received = 0
  if (req.body) {
    const reader = req.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      received += value?.length ?? 0
    }
  }
  return Response.json(
    { ok: true, received },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
