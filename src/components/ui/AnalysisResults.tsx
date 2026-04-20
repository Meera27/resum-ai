'use client'

import { useState } from 'react'
import type { MatchAnalysis, Suggestions } from '@/types'
import MatchScore from './MatchScore'

interface AnalysisResultsProps {
  matchAnalysis: MatchAnalysis
  suggestions: Suggestions
  coverLetter?: string | null
  hiringEmail?: string | null
}

export default function AnalysisResults({
  matchAnalysis,
  suggestions,
  coverLetter,
  hiringEmail
}: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'suggestions' | 'coverletter' | 'email'>('analysis')
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const showCoverLetterOptions = matchAnalysis.overallScore >= 60 && coverLetter
  const showEmailOptions = matchAnalysis.overallScore >= 60 && hiringEmail

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'analysis'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'suggestions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Suggestions
            </button>
            {showCoverLetterOptions && (
              <button
                onClick={() => setActiveTab('coverletter')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'coverletter'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cover Letter
              </button>
            )}
            {showEmailOptions && (
              <button
                onClick={() => setActiveTab('email')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'email'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Hiring Email
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <MatchScore score={matchAnalysis.overallScore} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Skill Match</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {matchAnalysis.skillMatch.score}%
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Experience Match</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {matchAnalysis.experienceMatch.score}%
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Education Match</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {matchAnalysis.educationMatch.score}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Matched Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchAnalysis.skillMatch.matched.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchAnalysis.skillMatch.missing.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {matchAnalysis.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Weaknesses</h4>
                <ul className="space-y-2">
                  {matchAnalysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              {suggestions.toAdd.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Add to Resume</h4>
                  <ul className="space-y-2">
                    {suggestions.toAdd.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.toRemove.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Consider Removing</h4>
                  <ul className="space-y-2">
                    {suggestions.toRemove.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.toImprove.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Improve These Bullets</h4>
                  <div className="space-y-4">
                    {suggestions.toImprove.map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-2">Current:</p>
                        <p className="text-gray-700 mb-3">{item.original}</p>
                        <p className="text-sm text-blue-600 mb-2">Suggested:</p>
                        <p className="text-gray-900 font-medium mb-2">{item.suggestion}</p>
                        <p className="text-xs text-gray-500">Reason: {item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.bulletPoints.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Suggested New Bullet Points</h4>
                  <ul className="space-y-2">
                    {suggestions.bulletPoints.map((bullet, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'coverletter' && coverLetter && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Cover Letter</h4>
                <button
                  onClick={() => copyToClipboard(coverLetter, 'coverletter')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {copied === 'coverletter' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-800 whitespace-pre-line">{coverLetter}</p>
              </div>
              <p className="mt-3 text-sm text-green-600 font-medium">
                ✓ Match score above 60% - ready to use!
              </p>
            </div>
          )}

          {activeTab === 'email' && hiringEmail && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Email to Hiring Team</h4>
                <button
                  onClick={() => copyToClipboard(hiringEmail, 'email')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {copied === 'email' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-800 whitespace-pre-line">{hiringEmail}</p>
              </div>
              <p className="mt-3 text-sm text-green-600 font-medium">
                ✓ Match score above 60% - ready to send!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
