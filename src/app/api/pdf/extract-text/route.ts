import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    // Import from the internal lib path to avoid pdf-parse's self-test that
    // tries to open './test/data/05-versions-space.pdf' on require()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (
      buf: Buffer
    ) => Promise<{ text: string; numpages: number; info: Record<string, unknown> }>

    const result = await pdfParse(buffer)

    return NextResponse.json({
      text: result.text,
      pages: result.numpages,
      info: result.info,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to parse PDF'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
