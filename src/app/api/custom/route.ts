import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getSessionId(req: NextRequest): string {
  return req.cookies.get('x-session-id')?.value || crypto.randomUUID()
}

function setCookieHeader(res: NextResponse, sessionId: string) {
  res.cookies.set('x-session-id', sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
}

export async function GET(req: NextRequest) {
  const sessionId = getSessionId(req)

  const apps = await prisma.customApp.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      isPublic: true,
      code: true,
    },
  })

  const res = NextResponse.json({ ok: true, data: apps })
  setCookieHeader(res, sessionId)
  return res
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, description, prompt } = body

  if (!title?.trim() || !prompt?.trim()) {
    return NextResponse.json(
      { ok: false, error: 'Title and prompt are required' },
      { status: 400 }
    )
  }

  const sessionId = getSessionId(req)

  const app = await prisma.customApp.create({
    data: {
      title: title.trim(),
      description: (description || prompt).substring(0, 300),
      prompt,
      code: '',
      sessionId,
    },
  })

  const res = NextResponse.json({ ok: true, data: app })
  setCookieHeader(res, sessionId)
  return res
}
