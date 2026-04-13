import { NextRequest } from 'next/server'

// Pre-generate a random 64 KB block once (hard to compress, reused across chunks)
const BLOCK_SIZE = 64 * 1024
const BLOCK = new Uint8Array(BLOCK_SIZE)
crypto.getRandomValues(BLOCK)

export async function GET(req: NextRequest) {
  const mb = Math.min(Math.max(parseInt(req.nextUrl.searchParams.get('size') ?? '20'), 1), 100)
  const totalBytes = mb * 1024 * 1024

  let sent = 0
  const stream = new ReadableStream({
    pull(controller) {
      if (sent >= totalBytes) {
        controller.close()
        return
      }
      const remaining = totalBytes - sent
      // Slice only if we're near the end, otherwise reuse the full block
      const chunk = remaining < BLOCK_SIZE ? BLOCK.slice(0, remaining) : BLOCK
      controller.enqueue(chunk)
      sent += chunk.length
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(totalBytes),
      'Cache-Control': 'no-store, no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
