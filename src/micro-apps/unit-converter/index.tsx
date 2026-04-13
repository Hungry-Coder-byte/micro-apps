'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const categories = {
  Length: {
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254, nm: 1e-9 },
    labels: { m: 'Meter (m)', km: 'Kilometer (km)', cm: 'Centimeter (cm)', mm: 'Millimeter (mm)', mi: 'Mile (mi)', yd: 'Yard (yd)', ft: 'Foot (ft)', in: 'Inch (in)', nm: 'Nanometer (nm)' },
  },
  Weight: {
    units: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.453592, oz: 0.0283495, t: 1000, st: 6.35029 },
    labels: { kg: 'Kilogram (kg)', g: 'Gram (g)', mg: 'Milligram (mg)', lb: 'Pound (lb)', oz: 'Ounce (oz)', t: 'Metric Ton (t)', st: 'Stone (st)' },
  },
  Temperature: {
    units: { C: 1, F: 1, K: 1 },
    labels: { C: 'Celsius (°C)', F: 'Fahrenheit (°F)', K: 'Kelvin (K)' },
  },
  Area: {
    units: { m2: 1, km2: 1e6, cm2: 1e-4, mm2: 1e-6, ha: 10000, acre: 4046.86, ft2: 0.092903, in2: 6.4516e-4, yd2: 0.836127 },
    labels: { m2: 'Sq Meter (m²)', km2: 'Sq Kilometer (km²)', cm2: 'Sq Centimeter (cm²)', mm2: 'Sq Millimeter (mm²)', ha: 'Hectare (ha)', acre: 'Acre', ft2: 'Sq Foot (ft²)', in2: 'Sq Inch (in²)', yd2: 'Sq Yard (yd²)' },
  },
  Volume: {
    units: { L: 1, mL: 0.001, m3: 1000, cm3: 0.001, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588, fl_oz: 0.0295735, tsp: 0.00492892, tbsp: 0.0147868 },
    labels: { L: 'Liter (L)', mL: 'Milliliter (mL)', m3: 'Cubic Meter (m³)', cm3: 'Cubic Centimeter (cm³)', gal: 'Gallon (US)', qt: 'Quart (US)', pt: 'Pint (US)', cup: 'Cup (US)', fl_oz: 'Fl. Ounce', tsp: 'Teaspoon', tbsp: 'Tablespoon' },
  },
  Speed: {
    units: { ms: 1, kmh: 0.277778, mph: 0.44704, kn: 0.514444, fts: 0.3048 },
    labels: { ms: 'm/s', kmh: 'km/h', mph: 'mph', kn: 'Knot (kn)', fts: 'ft/s' },
  },
}

function convertTemp(val: number, from: string, to: string): number {
  let celsius: number
  if (from === 'C') celsius = val
  else if (from === 'F') celsius = (val - 32) * 5 / 9
  else celsius = val - 273.15
  if (to === 'C') return celsius
  if (to === 'F') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

export default function UnitConverter() {
  const [category, setCategory] = useState('Length')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('ft')
  const [value, setValue] = useState('1')

  const cat = categories[category as keyof typeof categories]

  const result = useMemo(() => {
    const num = parseFloat(value)
    if (isNaN(num)) return null
    if (category === 'Temperature') {
      return convertTemp(num, fromUnit, toUnit)
    }
    const units = cat.units as Record<string, number>
    const baseValue = num * units[fromUnit]
    return baseValue / units[toUnit]
  }, [value, fromUnit, toUnit, category])

  function handleCategoryChange(c: string) {
    const newCat = categories[c as keyof typeof categories]
    const keys = Object.keys(newCat.units)
    setCategory(c)
    setFromUnit(keys[0])
    setToUnit(keys[1] ?? keys[0])
  }

  const units = Object.entries(cat.labels as Record<string, string>)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(categories).map(c => (
            <button
              key={c}
              onClick={() => handleCategoryChange(c)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${category === c ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {units.map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter value"
            className="text-lg font-mono"
          />
        </div>

        <div className="flex justify-center items-center">
          <div className="text-2xl text-muted-foreground">→</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {units.map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 text-lg font-mono">
            {result !== null ? result.toPrecision(8).replace(/\.?0+$/, '') : '—'}
          </div>
        </div>
      </div>

      {result !== null && (
        <div className="rounded-md border bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold">
            {value} {cat.labels[fromUnit as keyof typeof cat.labels]}
          </p>
          <p className="text-muted-foreground mt-1">=</p>
          <p className="text-2xl font-bold text-primary">
            {result.toPrecision(10).replace(/\.?0+$/, '')} {cat.labels[toUnit as keyof typeof cat.labels]}
          </p>
        </div>
      )}
    </div>
  )
}
