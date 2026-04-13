/** Download a PDF byte array as a file */
export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Send a PDF file to the server and get extracted text + page count */
export async function extractPdfText(file: File): Promise<{ text: string; pages: number }> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/pdf/extract-text', { method: 'POST', body: fd })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Extraction failed' }))
    throw new Error(err.error ?? 'Extraction failed')
  }
  return res.json()
}

/** Parse a comma/range string like "1,3,5-8" into 0-based indices (clamped to pageCount) */
export function parsePageList(input: string, pageCount: number): number[] {
  const indices = new Set<number>()
  for (const part of input.split(',')) {
    const t = part.trim()
    const range = t.match(/^(\d+)\s*-\s*(\d+)$/)
    if (range) {
      const from = parseInt(range[1]) - 1
      const to = parseInt(range[2]) - 1
      for (let i = from; i <= to; i++) if (i >= 0 && i < pageCount) indices.add(i)
    } else {
      const n = parseInt(t) - 1
      if (!isNaN(n) && n >= 0 && n < pageCount) indices.add(n)
    }
  }
  return [...indices].sort((a, b) => a - b)
}
