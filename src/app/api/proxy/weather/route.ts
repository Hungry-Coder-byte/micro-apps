import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city')
  if (!city) {
    return NextResponse.json({ ok: false, error: 'city is required' }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY
  if (!apiKey || apiKey === 'your_key_here') {
    return NextResponse.json(
      {
        ok: false,
        error: 'Weather API key not configured. Add OPENWEATHERMAP_API_KEY to .env.local',
        demo: {
          city: 'New York',
          temp: 72,
          feels_like: 70,
          description: 'Partly cloudy',
          humidity: 65,
          wind_speed: 8,
          icon: '02d',
        }
      },
      { status: 503 }
    )
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 600 } }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json(
        { ok: false, error: err.message ?? 'City not found' },
        { status: 404 }
      )
    }

    const d = await res.json()
    return NextResponse.json({
      ok: true,
      data: {
        city: d.name,
        country: d.sys.country,
        temp: Math.round(d.main.temp),
        feels_like: Math.round(d.main.feels_like),
        temp_min: Math.round(d.main.temp_min),
        temp_max: Math.round(d.main.temp_max),
        description: d.weather[0].description,
        humidity: d.main.humidity,
        wind_speed: d.wind.speed,
        icon: d.weather[0].icon,
        pressure: d.main.pressure,
        visibility: d.visibility,
      }
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}
