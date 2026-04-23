'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import FileUpload from '@/components/ui/FileUpload'
import JobDescriptionInput from '@/components/ui/JobDescriptionInput'
import AnalysisResults from '@/components/ui/AnalysisResults'
import type { AnalysisResult } from '@/types'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [resumeFileName, setResumeFileName] = useState<string>('')
  const [resumeData, setResumeData] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFileUploaded = (id: string, fileName: string, data: any) => {
    setResumeId(id)
    setResumeFileName(fileName)
    setResumeData(data)
    setError(null)
  }

  const handleAnalyze = async (jobDescription: string, jobTitle: string, companyName: string) => {
    if (!resumeId) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          jobDescription,
          jobTitle,
          companyName
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const data = await response.json()
      setAnalysisResult({
        matchAnalysis: data.matchData,
        suggestions: data.suggestions,
        coverLetter: data.coverLetter,
        hiringEmail: data.hiringEmail
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResumeId(null)
    setResumeFileName('')
    setResumeData(null)
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-foreground">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">ResumAI</h1>
              <p className="mt-2 text-sm text-muted">
                Upload your resume and analyze it against any job description
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {mounted && resumeId && (
                <button
                  onClick={handleReset}
                  className="text-sm font-medium border-2 border-foreground px-4 py-2 rounded hover:bg-foreground hover:text-background transition-colors"
                >
                  Start Over
                </button>
              )}
              {mounted && <ThemeToggle />}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {!resumeId ? (
          <div className="max-w-xl mx-auto text-center space-y-8 py-40">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Upload Your Resume
              </h2>
              <p className="text-sm text-muted">
                We'll parse your resume and extract key information
              </p>
            </div>
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        ) : (
          <div className="space-y-8">
            {!analysisResult ? (
              <>
                <div className="border-2 border-foreground rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Resume uploaded: {resumeFileName}</span>
                  </div>
                  {resumeData && (
                    <div className="mt-4 border-2 border-foreground rounded-lg p-4">
                      <h3 className="font-medium mb-2">Extracted Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted">Name:</span>
                          <span className="ml-2">{resumeData.name}</span>
                        </div>
                        <div>
                          <span className="text-muted">Email:</span>
                          <span className="ml-2">{resumeData.email}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-muted">Skills:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {resumeData.skills?.map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2 py-1 border border-foreground rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-2 border-foreground rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Paste Job Description
                  </h2>
                  <div className="flex justify-center">
                    <JobDescriptionInput
                      onSubmit={handleAnalyze}
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6 flex flex-col items-center">
                <div className="border-2 border-foreground rounded-lg p-4 flex items-center max-w-4xl w-full">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium">Analysis Complete!</p>
                    <p className="text-sm text-muted mt-1">
                      Review your match score, suggestions, and generated documents below.
                    </p>
                  </div>
                </div>

                <AnalysisResults
                  matchAnalysis={analysisResult.matchAnalysis}
                  suggestions={analysisResult.suggestions}
                  coverLetter={analysisResult.coverLetter}
                  hiringEmail={analysisResult.hiringEmail}
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 border-2 border-red-500 text-red-500 px-4 py-3 rounded-lg bg-background">
            {error}
          </div>
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
            <div className="border-2 border-foreground rounded-lg p-8 text-center bg-background">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-foreground border-t-transparent mx-auto mb-4" />
              <p className="font-medium">Analyzing your resume...</p>
              <p className="text-sm text-muted mt-2">This may take up to 30 seconds</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
