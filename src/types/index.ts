export interface ResumeData {
  name: string
  email: string
  phone: string
  summary: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
  certifications: string[]
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface Education {
  degree: string
  institution: string
  location: string
  graduationDate: string
  gpa?: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  link?: string
}

export interface JobData {
  title: string
  company: string
  requiredSkills: string[]
  preferredSkills: string[]
  requiredExperience: string[]
  responsibilities: string[]
  qualifications: string[]
}

export interface MatchAnalysis {
  overallScore: number
  skillMatch: {
    score: number
    matched: string[]
    missing: string[]
  }
  experienceMatch: {
    score: number
    yearsMatch: boolean
    relevantExperience: string[]
  }
  educationMatch: {
    score: number
    meetsRequirements: boolean
  }
  keywordMatch: {
    score: number
    matchedKeywords: string[]
    missingKeywords: string[]
  }
  strengths: string[]
  weaknesses: string[]
}

export interface Suggestions {
  toAdd: string[]
  toRemove: string[]
  toImprove: {
    original: string
    suggestion: string
    reason: string
  }[]
  bulletPoints: string[]
}

export interface AnalysisResult {
  matchAnalysis: MatchAnalysis
  suggestions: Suggestions
  coverLetter?: string
  hiringEmail?: string
}
