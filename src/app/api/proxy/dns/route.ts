import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns/promises'

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain')
  const type = (req.nextUrl.searchParams.get('type') ?? 'A').toUpperCase()

  if (!domain) {
    return NextResponse.json({ ok: false, error: 'domain is required' }, { status: 400 })
  }

  try {
    let records: unknown

    switch (type) {
      case 'A':
        records = await dns.resolve4(domain)
        break
      case 'AAAA':
        records = await dns.resolve6(domain)
        break
      case 'MX':
        records = await dns.resolveMx(domain)
        break
      case 'TXT':
        records = await dns.resolveTxt(domain)
        break
      case 'NS':
        records = await dns.resolveNs(domain)
        break
      case 'CNAME':
        records = await dns.resolveCname(domain)
        break
      case 'SOA':
        records = await dns.resolveSoa(domain)
        break
      default:
        return NextResponse.json(
          { ok: false, error: `Unsupported record type: ${type}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      ok: true,
      data: { domain, type, records }
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 400 }
    )
  }
}
