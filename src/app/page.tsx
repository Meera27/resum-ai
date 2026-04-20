'use client'

import { useState } from 'react'
import FileUpload from '@/components/ui/FileUpload'
import JobDescriptionInput from '@/components/ui/JobDescriptionInput'
import AnalysisResults from '@/components/ui/AnalysisResults'
import type { AnalysisResult } from '@/types'

export default function Home() {
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [resumeFileName, setResumeFileName] = useState<string>('')
  const [resumeData, setResumeData] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">ResumAI</h1>
            {resumeId && (
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Start Over
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-600">
            Upload your resume and analyze it against any job description
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {!resumeId ? (
          <div className="max-w-xl mx-auto text-center space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Your Resume
              </h2>
              <p className="text-gray-600">
                We'll parse your resume and extract key information
              </p>
            </div>
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        ) : (
          <div className="space-y-8">
            {!analysisResult ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-900">Resume uploaded: {resumeFileName}</span>
                  </div>
                  {resumeData && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Extracted Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <span className="ml-2 text-gray-900">{resumeData.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 text-gray-900">{resumeData.email}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {resumeData.skills?.slice(0, 8).map((skill: string) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {resumeData.skills?.length > 8 && (
                              <span className="text-gray-500 text-xs">+{resumeData.skills.length - 8} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Paste Job Description
                  </h2>
                  <JobDescriptionInput
                    onSubmit={handleAnalyze}
                    disabled={isAnalyzing}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-900">Analysis Complete!</p>
                    <p className="text-sm text-green-700">
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
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Analyzing your resume...</p>
              <p className="text-sm text-gray-500 mt-2">This may take up to 30 seconds</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
