import { registry, getBySlug } from '@/registry/registry'
import { AppShell } from '@/components/app-shell/AppShell'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const app = getBySlug(slug)

  if (!app) {
    return { title: 'Not Found' }
  }

  return {
    title: `${app.title} | MicroApps`,
    description: app.description,
    keywords: app.tags.join(', '),
  }
}

export async function generateStaticParams() {
  return registry.map(app => ({
    slug: app.slug,
  }))
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params
  const manifest = getBySlug(slug)

  if (!manifest) {
    notFound()
  }

  // Strip the load function before passing to client component
  const { load, ...safeManifest } = manifest

  return <AppShell manifest={safeManifest} slug={slug} />
}
