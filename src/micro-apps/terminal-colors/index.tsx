'use client'

import { Badge } from '@/components/ui/badge'
import { Construction } from 'lucide-react'

const STYLES = [
  { code: '0',  name: 'Reset',         preview: 'Normal text' },
  { code: '1',  name: 'Bold',          preview: 'Bold text' },
  { code: '2',  name: 'Dim',           preview: 'Dim text' },
  { code: '3',  name: 'Italic',        preview: 'Italic text' },
  { code: '4',  name: 'Underline',     preview: 'Underlined text' },
  { code: '9',  name: 'Strikethrough', preview: 'Strikethrough' },
]

const FG_COLORS = [
  { code: '30', name: 'Black',   hex: '#000000', bg: 'bg-gray-900'   },
  { code: '31', name: 'Red',     hex: '#cc0000', bg: 'bg-red-600'    },
  { code: '32', name: 'Green',   hex: '#4e9a06', bg: 'bg-green-600'  },
  { code: '33', name: 'Yellow',  hex: '#c4a000', bg: 'bg-yellow-500' },
  { code: '34', name: 'Blue',    hex: '#3465a4', bg: 'bg-blue-600'   },
  { code: '35', name: 'Magenta', hex: '#75507b', bg: 'bg-purple-600' },
  { code: '36', name: 'Cyan',    hex: '#06989a', bg: 'bg-cyan-600'   },
  { code: '37', name: 'White',   hex: '#d3d7cf', bg: 'bg-gray-200'   },
]

const BRIGHT = [
  { code: '90', name: 'Bright Black',   hex: '#555753', bg: 'bg-gray-600'   },
  { code: '91', name: 'Bright Red',     hex: '#ef2929', bg: 'bg-red-400'    },
  { code: '92', name: 'Bright Green',   hex: '#8ae234', bg: 'bg-green-400'  },
  { code: '93', name: 'Bright Yellow',  hex: '#fce94f', bg: 'bg-yellow-300' },
  { code: '94', name: 'Bright Blue',    hex: '#729fcf', bg: 'bg-blue-400'   },
  { code: '95', name: 'Bright Magenta', hex: '#ad7fa8', bg: 'bg-purple-400' },
  { code: '96', name: 'Bright Cyan',    hex: '#34e2e2', bg: 'bg-cyan-400'   },
  { code: '97', name: 'Bright White',   hex: '#eeeeec', bg: 'bg-gray-100'   },
]

const EXAMPLES = [
  { label: 'Red error text',     code: String.raw`\e[31mError: file not found\e[0m` },
  { label: 'Bold green success', code: String.raw`\e[1;32m✓ Build successful\e[0m` },
  { label: 'Yellow warning',     code: String.raw`\e[33mWarning: deprecated API\e[0m` },
  { label: 'Cyan info',          code: String.raw`\e[36mINFO Starting server...\e[0m` },
  { label: 'Blue + underline',   code: String.raw`\e[4;34mhttps://example.com\e[0m` },
]

export default function TerminalColors() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Text styles</div>
        <div className="divide-y">
          {STYLES.map(({ code, name, preview }) => (
            <div key={code} className="px-4 py-2.5 flex items-center gap-4 text-xs">
              <code className="font-mono text-primary w-24 shrink-0">\e[{code}m</code>
              <span className="text-muted-foreground w-24 shrink-0">{name}</span>
              <span className={`font-mono ${code === '1' ? 'font-bold' : code === '3' ? 'italic' : code === '4' ? 'underline' : code === '9' ? 'line-through' : code === '2' ? 'opacity-50' : ''}`}>{preview}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Foreground colors (30–37 / 90–97)</div>
        <div className="p-3 grid grid-cols-4 gap-2">
          {[...FG_COLORS, ...BRIGHT].map(({ code, name, hex, bg }) => (
            <div key={code} className="rounded-lg border overflow-hidden text-xs">
              <div className={`h-8 ${bg}`} />
              <div className="px-2 py-1.5">
                <code className="font-mono text-[10px] text-primary block">\e[{code}m</code>
                <p className="text-[10px] text-muted-foreground">{name}</p>
                <p className="text-[10px] font-mono text-muted-foreground/70">{hex}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t text-[10px] text-muted-foreground/60 text-center">
          Background colors: add 10 to foreground code (e.g. \e[41m = red background)
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Common usage examples</div>
        <div className="divide-y bg-gray-950 rounded-b-xl">
          {EXAMPLES.map(({ label, code }) => (
            <div key={label} className="px-4 py-2.5 text-xs">
              <p className="text-gray-500 text-[10px] mb-0.5"># {label}</p>
              <code className="font-mono text-green-400">{code}</code>
            </div>
          ))}
        </div>
      </div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Interactive playground coming soon
      </Badge>
    </div>
  )
}
