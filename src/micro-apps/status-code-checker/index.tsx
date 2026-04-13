'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const STATUS_CODES = [
  // 1xx
  { code: 100, name: 'Continue', desc: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, name: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols, and the server has agreed.' },
  { code: 102, name: 'Processing', desc: 'The server has received and is processing the request, but no response is available yet.' },
  { code: 103, name: 'Early Hints', desc: 'Used to return some response headers before final HTTP message.' },
  // 2xx
  { code: 200, name: 'OK', desc: 'The standard response for successful HTTP requests.' },
  { code: 201, name: 'Created', desc: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, name: 'Accepted', desc: 'The request has been accepted for processing, but has not been completed.' },
  { code: 204, name: 'No Content', desc: 'The server successfully processed the request and is not returning any content.' },
  { code: 206, name: 'Partial Content', desc: 'The server is delivering only part of the resource due to a range header sent by the client.' },
  // 3xx
  { code: 301, name: 'Moved Permanently', desc: 'This and all future requests should be directed to the given URI.' },
  { code: 302, name: 'Found', desc: 'Tells the client to look at another URL. HTTP/1.0 redirect.' },
  { code: 304, name: 'Not Modified', desc: 'Indicates that the resource has not been modified since the version specified by the request headers.' },
  { code: 307, name: 'Temporary Redirect', desc: 'The request should be repeated with another URI, preserving the HTTP method.' },
  { code: 308, name: 'Permanent Redirect', desc: 'The request and all future requests should be repeated using another URI, preserving the method.' },
  // 4xx
  { code: 400, name: 'Bad Request', desc: 'The server cannot or will not process the request due to malformed syntax or invalid input.' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication is required and has failed or has not been provided.' },
  { code: 403, name: 'Forbidden', desc: 'The server understood the request but refuses to authorize it.' },
  { code: 404, name: 'Not Found', desc: 'The requested resource could not be found on this server.' },
  { code: 405, name: 'Method Not Allowed', desc: 'A request method is not supported for the requested resource.' },
  { code: 408, name: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
  { code: 409, name: 'Conflict', desc: 'The request could not be processed because of conflict in the request, such as an edit conflict.' },
  { code: 410, name: 'Gone', desc: 'The resource requested is no longer available and will not be available again.' },
  { code: 422, name: 'Unprocessable Entity', desc: 'The request was well-formed but was unable to be followed due to semantic errors.' },
  { code: 429, name: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time (rate limiting).' },
  // 5xx
  { code: 500, name: 'Internal Server Error', desc: 'A generic error message, given when an unexpected condition was encountered.' },
  { code: 501, name: 'Not Implemented', desc: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.' },
  { code: 502, name: 'Bad Gateway', desc: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, name: 'Service Unavailable', desc: 'The server is currently unavailable (overloaded or down for maintenance).' },
  { code: 504, name: 'Gateway Timeout', desc: 'The server was acting as a gateway or proxy and did not receive a timely response.' },
]

function categoryColor(code: number) {
  if (code < 200) return 'bg-blue-500'
  if (code < 300) return 'bg-green-500'
  if (code < 400) return 'bg-yellow-500'
  if (code < 500) return 'bg-orange-500'
  return 'bg-red-500'
}

function categoryBadge(code: number) {
  if (code < 200) return 'Informational'
  if (code < 300) return 'Success'
  if (code < 400) return 'Redirection'
  if (code < 500) return 'Client Error'
  return 'Server Error'
}

export default function StatusCodeChecker() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof STATUS_CODES[0] | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return STATUS_CODES.filter(s =>
      String(s.code).includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q)
    )
  }, [search])

  const groups = useMemo(() => {
    const g: Record<string, typeof STATUS_CODES> = { '1xx': [], '2xx': [], '3xx': [], '4xx': [], '5xx': [] }
    filtered.forEach(s => {
      const key = `${Math.floor(s.code / 100)}xx`
      if (g[key]) g[key].push(s)
    })
    return g
  }, [filtered])

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by code, name or description..."
        className="max-w-md"
      />

      {selected && (
        <div className="rounded-lg border p-4 space-y-2">
          <div className="flex items-center gap-3">
            <span className={`text-4xl font-bold font-mono text-white rounded-lg px-3 py-1 ${categoryColor(selected.code)}`}>{selected.code}</span>
            <div>
              <h3 className="text-lg font-bold">{selected.name}</h3>
              <Badge variant="outline">{categoryBadge(selected.code)}</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">{selected.desc}</p>
          <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground underline">Close</button>
        </div>
      )}

      {Object.entries(groups).map(([group, codes]) => (
        codes.length > 0 && (
          <div key={group}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{group} — {categoryBadge(parseInt(group) * 100)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {codes.map(sc => (
                <button
                  key={sc.code}
                  onClick={() => setSelected(selected?.code === sc.code ? null : sc)}
                  className={`text-left rounded-md border p-3 hover:bg-muted/50 transition-colors ${selected?.code === sc.code ? 'border-primary bg-primary/5' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-white text-xs font-bold font-mono rounded px-1.5 py-0.5 ${categoryColor(sc.code)}`}>{sc.code}</span>
                    <span className="font-medium text-sm">{sc.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{sc.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
}
