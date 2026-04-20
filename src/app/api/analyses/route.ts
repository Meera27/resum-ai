import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { performFullAnalysis } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeId, jobDescription, jobTitle, companyName } = body

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { error: 'resumeId and jobDescription are required' },
        { status: 400 }
      )
    }

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const result = await performFullAnalysis(resume.rawText, jobDescription)

    const analysis = await prisma.analysis.create({
      data: {
        userId: 'demo-user',
        resumeId,
        jobDescription,
        jobTitle: jobTitle || null,
        companyName: companyName || null,
        matchScore: result.matchAnalysis.overallScore,
        matchData: result.matchAnalysis as any,
        suggestions: result.suggestions as any,
        coverLetter: result.coverLetter || null,
        hiringEmail: result.hiringEmail || null
      }
    })

    return NextResponse.json({
      id: analysis.id,
      matchScore: analysis.matchScore,
      matchData: analysis.matchData,
      suggestions: analysis.suggestions,
      coverLetter: analysis.coverLetter,
      hiringEmail: analysis.hiringEmail,
      createdAt: analysis.createdAt
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const analyses = await prisma.analysis.findMany({
      include: {
        resume: {
          select: {
            fileName: true,
            data: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(analyses)
  } catch (error) {
    console.error('Get analyses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}
