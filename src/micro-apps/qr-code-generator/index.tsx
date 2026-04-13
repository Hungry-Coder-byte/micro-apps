'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QrCode, Construction, Download } from 'lucide-react'

export default function QrCodeGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs mb-1.5 block">Content type</Label>
            <Select defaultValue="url">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="url">URL / Link</SelectItem>
                <SelectItem value="text">Plain text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone number</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="wifi">WiFi credentials</SelectItem>
                <SelectItem value="vcard">vCard (contact)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Content</Label>
            <Input defaultValue="https://example.com" className="h-9" placeholder="Enter URL or text…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Size (px)</Label>
              <Select defaultValue="256">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128</SelectItem>
                  <SelectItem value="256">256</SelectItem>
                  <SelectItem value="512">512</SelectItem>
                  <SelectItem value="1024">1024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Error correction</Label>
              <Select defaultValue="M">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">L — 7%</SelectItem>
                  <SelectItem value="M">M — 15%</SelectItem>
                  <SelectItem value="Q">Q — 25%</SelectItem>
                  <SelectItem value="H">H — 30%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Foreground</Label>
              <div className="flex gap-2">
                <input type="color" defaultValue="#000000" className="h-9 w-9 rounded border cursor-not-allowed opacity-60" disabled />
                <Input defaultValue="#000000" className="font-mono h-9" disabled />
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Background</Label>
              <div className="flex gap-2">
                <input type="color" defaultValue="#ffffff" className="h-9 w-9 rounded border cursor-not-allowed opacity-60" disabled />
                <Input defaultValue="#ffffff" className="font-mono h-9" disabled />
              </div>
            </div>
          </div>
        </div>

        {/* QR placeholder */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-48 h-48 rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center bg-muted/10 text-muted-foreground">
            <QrCode className="h-16 w-16 opacity-20" />
            <p className="text-xs mt-2">QR code preview</p>
          </div>
          <Button disabled variant="outline" className="gap-2 opacity-60 w-full">
            <Download className="h-4 w-4" /> Download PNG
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <QrCode className="h-4 w-4" /> Generate QR Code
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
