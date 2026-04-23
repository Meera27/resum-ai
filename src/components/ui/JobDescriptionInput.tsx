'use client'

import { useState } from 'react'

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string, jobTitle: string, companyName: string) => void
  disabled?: boolean
}

export default function JobDescriptionInput({ onSubmit, disabled }: JobDescriptionInputProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobDescription.trim()) return
    onSubmit(jobDescription, jobTitle, companyName)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Job Title (optional)
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-3 py-2 border-2 border-foreground bg-transparent rounded focus:outline-none"
            placeholder="e.g., Senior Software Engineer"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Name (optional)
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 border-2 border-foreground bg-transparent rounded focus:outline-none"
            placeholder="e.g., Acme Inc."
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Job Description *
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={16}
          className="w-full px-3 py-2 border-2 border-foreground bg-transparent rounded focus:outline-none"
          placeholder="Paste the full job description here..."
          disabled={disabled}
          required
        />
      </div>

      <button
        type="submit"
        disabled={!jobDescription.trim() || disabled}
        className="w-full px-4 py-3 border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background disabled:border-muted disabled:text-muted disabled:cursor-not-allowed transition-colors font-medium"
      >
        Analyze Match
      </button>
    </form>
  )
}
