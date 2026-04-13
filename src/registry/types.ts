export enum AppCategory {
  DEVELOPER    = 'developer',
  DATA         = 'data',
  API_NETWORK  = 'api-network',
  GEO          = 'geo',
  FILE         = 'file',
  PRODUCTIVITY = 'productivity',
  SECURITY     = 'security',
  AUTOMATION   = 'automation',
  DATA_PROC    = 'data-processing',
  AI           = 'ai',
  PDF          = 'pdf',
}

export type ExecutionMode = 'client-only' | 'server-assisted'

export interface AppManifest {
  slug: string
  title: string
  description: string
  category: AppCategory
  tags: string[]
  icon: string
  executionMode: ExecutionMode
  featured?: boolean
  externalApis?: string[]
  docsUrl?: string
}

export interface MicroAppComponentProps {
  serverFetch?: (service: string, params: Record<string, string>) => Promise<unknown>
}

export interface RegisteredApp extends AppManifest {
  load: () => Promise<{ default: React.ComponentType<MicroAppComponentProps> }>
}
