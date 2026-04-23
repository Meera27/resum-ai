import { openai } from './openai'
import type { ResumeData, JobData, MatchAnalysis, Suggestions, AnalysisResult } from '@/types'

export async function parseResumeWithAI(resumeText: string): Promise<ResumeData> {
  const response = await openai.chat.completions.create({
    model: 'qwen3.5-plus',
    messages: [
      { 
        role: 'user', 
        content: `Extract the following information from this resume and return as JSON:
{
  "name": "",
  "email": "",
  "phone": "",
  "summary": "",
  "skills": [],
  "experience": [{"title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "bullets": []}],
  "education": [{"degree": "", "institution": "", "location": "", "graduationDate": "", "gpa": ""}],
  "projects": [{"name": "", "description": "", "technologies": [], "link": ""}],
  "certifications": []
}

Return ONLY valid JSON, no markdown, no explanations.

Resume:
${resumeText}`
      }
    ],
    temperature: 0
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('Failed to parse resume')

  const json = content.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim()
  return JSON.parse(json)
}

export async function parseJobWithAI(jobDescription: string): Promise<JobData> {
  const response = await openai.chat.completions.create({
    model: 'qwen3.5-plus',
    messages: [
      {
        role: 'user',
        content: `Extract the following information from this job description and return as JSON:
{
  "title": "",
  "company": "",
  "requiredSkills": [],
  "preferredSkills": [],
  "requiredExperience": [],
  "responsibilities": [],
  "qualifications": []
}

Return ONLY valid JSON, no markdown, no explanations.

Job Description:
${jobDescription}`
      }
    ],
    temperature: 0
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('Failed to parse job description')

  const json = content.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim()
  return JSON.parse(json)
}

export async function analyzeMatch(resumeText: string, jobDescription: string): Promise<MatchAnalysis> {
  const response = await openai.chat.completions.create({
    model: 'qwen3.5-plus',
    messages: [
      {
        role: 'user',
        content: `Analyze the match between this resume and job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return a JSON analysis with this exact structure:
{
  "overallScore": 0,
  "skillMatch": {
    "score": 0,
    "matched": [],
    "missing": []
  },
  "experienceMatch": {
    "score": 0,
    "yearsMatch": false,
    "relevantExperience": []
  },
  "educationMatch": {
    "score": 0,
    "meetsRequirements": false
  },
  "keywordMatch": {
    "score": 0,
    "matchedKeywords": [],
    "missingKeywords": []
  },
  "strengths": [],
  "weaknesses": []
}

Scoring guidelines:
- overallScore: 0-100 based on all factors
- skillMatch: compare resume skills vs job requirements
- experienceMatch: check years and relevance
- educationMatch: verify if education meets requirements
- keywordMatch: ATS keyword optimization

Return ONLY valid JSON, no markdown, no explanations.`
      }
    ],
    temperature: 0
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('Failed to analyze match')

  const json = content.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim()
  return JSON.parse(json)
}

export async function generateSuggestions(
  resumeText: string,
  jobDescription: string,
  analysis: MatchAnalysis
): Promise<Suggestions> {
  const response = await openai.chat.completions.create({
    model: 'qwen3.5-plus',
    messages: [
      {
        role: 'user',
        content: `Based on this resume and job description, provide specific suggestions to improve the resume.

Resume:
${resumeText}

Job Description:
${jobDescription}

Match Analysis:
${JSON.stringify(analysis)}

Return suggestions as JSON with this exact structure:
{
  "toAdd": [],
  "toRemove": [],
  "toImprove": [
    {
      "original": "",
      "suggestion": "",
      "reason": ""
    }
  ],
  "bulletPoints": []
}

Guidelines:
- toAdd: skills, keywords, or sections missing that are in the JD
- toRemove: irrelevant or outdated content
- toImprove: existing bullets that could be stronger with metrics/impact
- bulletPoints: new bullet point suggestions tailored to the JD

Return ONLY valid JSON, no markdown, no explanations.`
      }
    ],
    temperature: 0.3
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('Failed to generate suggestions')

  const json = content.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim()
  return JSON.parse(json)
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  score: number,
  strengths: string[]
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'qwen3.5-plus',
    messages: [
      {
        role: 'user',
        content: `Write a compelling cover letter for this job application.

Resume:
${resumeText}

Job Description:
${jobDescription}

Match Score: ${score}%

Key Strengths:
${strengths.join('\n')}

Write a professional cover letter that:
1. Opens with enthusiasm for the role and company
2. Highlights 2-3 most relevant experiences/skills using bullet points for readability
3. Shows understanding of the role requirements
4. Demonstrates value the candidate brings
5. Ends with a call to action

Format the second paragraph with bullet points (using - or •) to list key skills and qualifications for easy reading.

Keep it concise (250-350 words), professional, and tailored to the specific job.`
      }
    ],
    temperature: 0.5
  })

  return response.choices[0]?.message?.content?.trim() || ''
}

export async function generateHiringEmail(
  resumeText: string,
  jobDescription: string,
  score: number
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'qwen3.5-plus',
    messages: [
      {
        role: 'user',
        content: `Write a short email to send to the hiring team/recruiter along with the resume.

Resume:
${resumeText}

Job Description:
${jobDescription}

Match Score: ${score}%

Write a brief, professional email that:
1. Has a clear subject line
2. Introduces the candidate briefly
3. Mentions 1-2 key qualifications using bullet points for readability
4. Expresses interest in the role
5. Includes a call to action

Format the qualifications section with bullet points (using - or •) for easy reading.

Keep it under 150 words, professional, and easy to read.`
      }
    ],
    temperature: 0.5
  })

  return response.choices[0]?.message?.content?.trim() || ''
}

export async function performFullAnalysis(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const matchAnalysis = await analyzeMatch(resumeText, jobDescription)
  const suggestions = await generateSuggestions(resumeText, jobDescription, matchAnalysis)

  const result: AnalysisResult = {
    matchAnalysis,
    suggestions
  }

  if (matchAnalysis.overallScore >= 60) {
    const [coverLetter, hiringEmail] = await Promise.all([
      generateCoverLetter(
        resumeText,
        jobDescription,
        matchAnalysis.overallScore,
        matchAnalysis.strengths
      ),
      generateHiringEmail(resumeText, jobDescription, matchAnalysis.overallScore)
    ])
    result.coverLetter = coverLetter
    result.hiringEmail = hiringEmail
  }

  return result
}
