import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://meera@localhost:5432/resum_ai?schema=public'
  }
})
