export async function GET() {
  return Response.json(
    { pong: true, ts: Date.now() },
    { headers: { 'Cache-Control': 'no-store, no-cache' } }
  )
}
