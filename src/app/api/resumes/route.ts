import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseResume } from '@/lib/parser'
import { parseResumeWithAI, performFullAnalysis } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const rawText = await parseResume(buffer, file.type)

    const parsedData = await parseResumeWithAI(rawText)

    let user = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: 'demo-user',
          email: 'demo@example.com',
          name: 'Demo User'
        }
      })
    }

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        rawText,
        data: parsedData as any
      }
    })

    return NextResponse.json({
      id: resume.id,
      fileName: resume.fileName,
      data: resume.data
    })
  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process resume' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(resumes)
  } catch (error) {
    console.error('Get resumes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}
