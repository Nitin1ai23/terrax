import { useEffect, useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import WorldMap, { BASE_LAYERS, type BaseLayerId, type ClickInfo } from '@/components/map/WorldMap'
import { Layers, Search } from '@/components/Icons'
import { useAssistantStore } from '@/store/assistantStore'
import { geocode, type GeoResult } from '@/utils/geocode'

const TOOLS = ['Measure distance', 'Measure area', 'Cross-section', 'Mark point', 'Volume box']

export default function MapView() {
  const setContext = useAssistantStore((s) => s.setContext)
  useEffect(() => setContext({ page: 'map' }), [setContext])

  const [base, setBase] = useState<BaseLayerId>('satellite')
  const [showLabels, setShowLabels] = useState(true)
  const [showContours, setShowContours] = useState(false)
  const [contourOpacity, setContourOpacity] = useState(0.5)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null)
  const [marker, setMarker] = useState<ClickInfo | null>(null)

  async function runSearch() {
    const q = query.trim()
    if (!q) return
    setSearching(true)
    setSearchError(null)
    setResults([])
    try {
      const hits = await geocode(q)
      if (hits.length === 0) {
        setSearchError('No places found. Try a city, address, or landmark.')
      } else {
        setResults(hits)
        setFlyTarget({ lat: hits[0].lat, lng: hits[0].lng, zoom: 13 })
        setMarker({ lat: hits[0].lat, lng: hits[0].lng })
      }
    } catch {
      setSearchError("Couldn't reach the place search service. Check your connection.")
    } finally {
      setSearching(false)
    }
  }

  function goTo(r: GeoResult) {
    setFlyTarget({ lat: r.lat, lng: r.lng, zoom: 14 })
    setMarker({ lat: r.lat, lng: r.lng })
  }

  return (
    <>
      <PageHeader title="World map" subtitle="Global imagery · OSM / Esri / OpenTopoMap" />
      <div className="flex-1 flex min-h-0">
        {/* Layer manager */}
        <aside className="w-[260px] shrink-0 border-r border-border bg-surface/30 overflow-y-auto">
          <div className="p-4 border-b border-border flex items-center gap-2 text-text-muted">
            <Layers size={16} />
            <span className="data-label">Map layers</span>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 border border-border rounded-md bg-void px-3 py-2 focus-within:border-topo/60 transition-colors">
              <Search size={16} className="text-text-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void runSearch()}
                placeholder="Search any place on Earth…"
                className="bg-transparent w-full outline-none text-sm placeholder:text-text-muted/60"
              />
            </div>
            <button onClick={() => void runSearch()} disabled={searching} className="btn-primary w-full mt-2 !py-2 text-sm">
              {searching ? 'Searching…' : 'Search'}
            </button>
            {searchError && <p className="text-data text-xs mt-2">{searchError}</p>}
            {results.length > 0 && (
              <ul className="mt-2 space-y-1">
                {results.map((r, i) => (
                  <li key={i}>
                    <button
                      onClick={() => goTo(r)}
                      className="w-full text-left text-xs text-text-muted hover:text-topo px-2 py-1.5 rounded hover:bg-void transition-colors line-clamp-2"
                    >
                      {r.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Base map */}
          <div className="p-3 border-b border-border">
            <div className="data-label mb-2">Base map</div>
            <div className="space-y-1">
              {(Object.keys(BASE_LAYERS) as BaseLayerId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setBase(id)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                    base === id
                      ? 'bg-topo/10 text-topo border border-topo/30'
                      : 'text-text-muted hover:text-text-primary hover:bg-void border border-transparent'
                  }`}
                >
                  {BASE_LAYERS[id].label}
                </button>
              ))}
            </div>
          </div>

          {/* Overlays */}
          <div className="p-3 space-y-3">
            <div className="data-label">Overlays</div>
            <div className="surface-card p-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={showLabels} onChange={() => setShowLabels((v) => !v)} className="accent-topo w-4 h-4" />
                <span className="text-sm flex-1">Place labels</span>
              </label>
              <p className="data-label mt-1 !text-[10px]">on satellite base</p>
            </div>
            <div className="surface-card p-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={showContours} onChange={() => setShowContours((v) => !v)} className="accent-topo w-4 h-4" />
                <span className="text-sm flex-1">Terrain contours</span>
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={contourOpacity}
                disabled={!showContours}
                onChange={(e) => setContourOpacity(Number(e.target.value))}
                className="w-full mt-2.5 accent-topo disabled:opacity-30"
              />
              <div className="data-label mt-1 !text-[10px]">opacity {Math.round(contourOpacity * 100)}%</div>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 relative bg-void min-w-0">
          {/* Floating toolbar */}
          <div className="absolute left-4 top-4 z-[1000] surface-card p-1.5 flex flex-col gap-1">
            {TOOLS.map((t) => (
              <button
                key={t}
                title={t}
                className="font-mono text-[10px] text-text-muted hover:text-topo hover:bg-void px-2 py-2 rounded transition-colors text-left w-32"
              >
                {t}
              </button>
            ))}
          </div>

          <WorldMap
            base={base}
            showLabels={showLabels}
            showContours={showContours}
            contourOpacity={contourOpacity}
            flyTarget={flyTarget}
            marker={marker}
            onPick={setMarker}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] surface-card px-5 py-2.5 flex items-center gap-4 pointer-events-none">
            <span className="data-label">{BASE_LAYERS[base].label}</span>
            <span className="text-border">|</span>
            <span className="data-label">Click the map to inspect a point</span>
          </div>
        </div>

        {/* Inspector */}
        <aside className="w-[280px] shrink-0 border-l border-border bg-surface/30 p-4 overflow-y-auto">
          <span className="data-label">Data inspector</span>
          {marker ? (
            <div className="surface-card p-4 mt-3 space-y-3">
              {[
                ['Latitude', marker.lat.toFixed(6)],
                ['Longitude', marker.lng.toFixed(6)],
                ['Tile source', BASE_LAYERS[base].label],
                ['Zoom hint', 'scroll to zoom'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm gap-3">
                  <span className="text-text-muted shrink-0">{k}</span>
                  <span className="num text-right">{v}</span>
                </div>
              ))}
              <a
                className="link-topo text-sm"
                href={`https://www.openstreetmap.org/?mlat=${marker.lat}&mlon=${marker.lng}#map=14/${marker.lat}/${marker.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in OpenStreetMap →
              </a>
            </div>
          ) : (
            <p className="text-text-muted text-sm mt-3">
              Search for a place or click anywhere on the map to inspect coordinates.
            </p>
          )}
          <button className="btn-ghost w-full mt-4 !py-2 text-sm">Export selected region</button>
        </aside>
      </div>
    </>
  )
}
