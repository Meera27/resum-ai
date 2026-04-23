# ResumAI

AI-powered resume analyzer that matches your resume against job descriptions and provides actionable feedback.
<img width="1419" height="693" alt="Screenshot 2026-04-22 at 9 37 45 PM" src="https://github.com/user-attachments/assets/7f5d8722-7002-4e01-8380-292b71a53b3d" />


## Features

- **Resume Upload**: Upload PDF or DOCX resumes
- **Job Description Analysis**: Paste any job description
- **Match Scoring**: Get a detailed match score (0-100%)
- **Skill Gap Analysis**: See matched and missing skills
- **Resume Suggestions**: Get specific suggestions to improve your resume
- **Cover Letter Generation**: Auto-generate cover letters for matches ≥60%
- **Hiring Email Templates**: Get email drafts to send to hiring teams

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **AI**: qwen3.5-plus

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env`:
```env
DATABASE_URL="postgresql://meera@localhost:5432/resum_ai?schema=public"
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

**Note:** Make sure PostgreSQL is running. If you installed via Homebrew:
```bash
brew services start postgresql@15
```

## How It Works

1. **Upload Resume**: Parses PDF/DOCX and extracts structured data using AI
2. **Paste Job Description**: AI extracts requirements, skills, and qualifications
3. **Match Analysis**: Compares resume vs job across 4 dimensions:
   - Skill match (40% weight)
   - Experience match (30% weight)
   - Education match (20% weight)
   - Keyword match (10% weight)
4. **Suggestions**: AI generates specific improvements
5. **Cover Letter & Email**: Generated automatically if match ≥60%

<img width="1419" height="693" alt="Screenshot 2026-04-22 at 9 37 45 PM" src="https://github.com/user-attachments/assets/13925dda-4af5-46de-bb81-ab27fad28eb5" />

## API Endpoints

### POST /api/resumes
Upload a resume file (PDF/DOCX)

### GET /api/resumes
List all uploaded resumes

### POST /api/analyses
Analyze a resume against a job description

### GET /api/analyses
List all analyses

## Project Structure

```
resum-ai/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── resumes/    # Resume upload API
│   │   │   └── analyses/   # Analysis API
│   │   ├── page.tsx        # Main page
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   └── ui/             # UI components
│   ├── lib/
│   │   ├── prisma.ts       # Prisma client
│   │   ├── openai.ts       # OpenAI client
│   │   ├── parser.ts       # File parser
│   │   └── ai.ts           # AI analysis functions
│   └── types/
│       └── index.ts        # TypeScript types
└── .env                    # Environment variables
```

## Demo User

For the MVP, all data is stored under a demo user ID (`demo-user`). Add authentication before production use.
