'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CATEGORIES = [
  'Developer Tools',
  'Data & Conversion',
  'API & Network',
  'Geo & Location',
  'File & Encoding',
  'Security',
  'Automation',
  'Data Processing',
  'Other',
]

export default function RequestAppPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Failed to submit request')
        return
      }

      setSuccess(true)
      setFormData({ title: '', description: '', category: '', email: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Request a New App</h1>
          <p className="text-muted-foreground mb-8">
            Can't find the tool you need? Tell us what you want, and we'll build it for you.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>App Request</CardTitle>
              <CardDescription>
                $9.99 per request. Our team will review and build your requested app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-4 text-sm text-green-800">
                  ✓ Request submitted successfully! We'll be in touch soon.
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4 mb-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">App Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Code Comment Remover"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this app should do, features, inputs, outputs..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={cat => setFormData({ ...formData, category: cat })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !formData.title || !formData.description || !formData.category || !formData.email}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Submitting...' : 'Submit Request ($9.99)'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
