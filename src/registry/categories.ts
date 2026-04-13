import { AppCategory } from './types'

export const categoryMeta: Record<AppCategory, { label: string; icon: string; color: string; description: string }> = {
  [AppCategory.AI]:           { label: 'AI Tools',           icon: 'Brain',          color: 'bg-violet-500',  description: 'Local AI via Ollama — summarize, fix, explain, analyze' },
  [AppCategory.DEVELOPER]:    { label: 'Developer Tools',    icon: 'Code2',          color: 'bg-blue-500',    description: 'JSON, Base64, Regex, UUID and more' },
  [AppCategory.DATA]:         { label: 'Data & Conversion',  icon: 'ArrowLeftRight', color: 'bg-green-500',   description: 'Units, Currency, Dates, Calculations' },
  [AppCategory.API_NETWORK]:  { label: 'API & Network',      icon: 'Globe2',         color: 'bg-purple-500',  description: 'Test APIs, DNS, IP lookup and more' },
  [AppCategory.GEO]:          { label: 'Geo & Location',     icon: 'MapPin',         color: 'bg-orange-500',  description: 'Weather, Distances, Coordinates' },
  [AppCategory.FILE]:         { label: 'File & Encoding',    icon: 'FileCode2',      color: 'bg-cyan-500',    description: 'Base64 images, OCR, CSV, JSON' },
  [AppCategory.PRODUCTIVITY]: { label: 'Dev Productivity',   icon: 'Zap',            color: 'bg-yellow-500',  description: 'Diff, Minifier, GraphQL and more' },
  [AppCategory.SECURITY]:     { label: 'Security',           icon: 'Shield',         color: 'bg-red-500',     description: 'Passwords, Encryption, JWT, CORS' },
  [AppCategory.AUTOMATION]:   { label: 'Automation',         icon: 'Bot',            color: 'bg-pink-500',    description: 'Data mapping, Webhooks, Cron jobs' },
  [AppCategory.DATA_PROC]:    { label: 'Data Processing',    icon: 'Database',       color: 'bg-indigo-500',  description: 'JSON queries, CSV analysis, Logs' },
  [AppCategory.PDF]:          { label: 'PDF Tools',          icon: 'FileText',       color: 'bg-rose-500',    description: 'Convert, edit, merge, split, secure and analyze PDFs' },
}
