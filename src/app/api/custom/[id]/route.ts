import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

function getSessionId(req: NextRequest): string {
  return req.cookies.get('x-session-id')?.value || ''
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params
  const sessionId = getSessionId(req)

  const app = await prisma.customApp.findFirst({
    where: {
      id,
      OR: [{ sessionId }, { isPublic: true }],
    },
  })

  if (!app) {
    return NextResponse.json({ ok: false, error: 'App not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, data: app })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const sessionId = getSessionId(req)
  const body = await req.json()

  const existing = await prisma.customApp.findFirst({ where: { id, sessionId } })
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'App not found' }, { status: 404 })
  }

  const updated = await prisma.customApp.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.code !== undefined && { code: body.code }),
      ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
      ...(body.prompt !== undefined && { prompt: body.prompt }),
    },
  })

  return NextResponse.json({ ok: true, data: updated })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  const sessionId = getSessionId(req)

  const existing = await prisma.customApp.findFirst({ where: { id, sessionId } })
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'App not found' }, { status: 404 })
  }

  await prisma.customApp.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
