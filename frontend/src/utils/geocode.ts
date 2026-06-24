// Free worldwide place search via OpenStreetMap's Nominatim geocoder (no key).
// Used to fly the map to any address, city, or landmark on Earth.

export interface GeoResult {
  name: string
  lat: number
  lng: number
}

export async function geocode(query: string): Promise<GeoResult[]> {
  const q = query.trim()
  if (!q) return []
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(q)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`)
  const rows = (await res.json()) as Array<{ display_name: string; lat: string; lon: string }>
  return rows.map((r) => ({
    name: r.display_name,
    lat: Number(r.lat),
    lng: Number(r.lon),
  }))
}
