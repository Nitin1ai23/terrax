import { useEffect, useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import { Sparkle, Arrow } from '@/components/Icons'
import { useAssistantStore } from '@/store/assistantStore'
import type { AnalysisMethod, VariogramModel } from '@/types'

const METHODS: { id: AnalysisMethod; label: string; group: string }[] = [
  { id: 'ordinary_kriging', label: 'Ordinary Kriging', group: 'Kriging' },
  { id: 'indicator_kriging', label: 'Indicator Kriging', group: 'Kriging' },
  { id: 'categorical_kriging', label: 'Categorical Kriging', group: 'Kriging' },
  { id: 'cokriging', label: 'Co-Kriging', group: 'Kriging' },
  { id: 'gwr', label: 'GWR', group: 'Regression' },
  { id: 'compositional', label: 'Compositional Data', group: 'Multivariate' },
  { id: 'spacetime', label: 'Space-Time', group: 'Temporal' },
]

const MODEL_OPTIONS: VariogramModel[] = ['spherical', 'exponential', 'gaussian', 'matern']

// Tiny inline variogram plot (spherical model) — avoids a chart dependency.
function VariogramPlot({ nugget, sill, range, model }: { nugget: number; sill: number; range: number; model: VariogramModel }) {
  const W = 280
  const H = 120
  const maxLag = range * 1.6
  const gamma = (h: number) => {
    if (h <= 0) return nugget
    const c = sill - nugget
    switch (model) {
      case 'spherical':
        return h >= range ? sill : nugget + c * (1.5 * (h / range) - 0.5 * (h / range) ** 3)
      case 'exponential':
        return nugget + c * (1 - Math.exp(-3 * h / range))
      case 'gaussian':
        return nugget + c * (1 - Math.exp(-3 * (h / range) ** 2))
      case 'matern':
        return nugget + c * (1 - (1 + Math.sqrt(3) * h / range) * Math.exp(-Math.sqrt(3) * h / range))
    }
  }
  const pts = Array.from({ length: 50 }, (_, i) => {
    const h = (i / 49) * maxLag
    const x = (h / maxLag) * W
    const y = H - (gamma(h) / (sill * 1.1)) * H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  // Scatter of pseudo-empirical points
  const scatter = Array.from({ length: 12 }, (_, i) => {
    const h = ((i + 0.5) / 12) * maxLag
    const jitter = (Math.sin(i * 2.3) * 0.12 + 1) * gamma(h)
    return { cx: (h / maxLag) * W, cy: H - (jitter / (sill * 1.1)) * H }
  })
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-border rounded bg-void">
      <line x1="0" y1={H} x2={W} y2={H} stroke="#1E2A33" />
      {scatter.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="2.5" fill="#FF6B35" opacity="0.7" />
      ))}
      <polyline points={pts} fill="none" stroke="#2AFFA0" strokeWidth="1.8" />
    </svg>
  )
}

export default function Analysis() {
  const setContext = useAssistantStore((s) => s.setContext)
  const [method, setMethod] = useState<AnalysisMethod>('ordinary_kriging')
  const [model, setModel] = useState<VariogramModel>('spherical')
  const [params, setParams] = useState({ nugget: 5, sill: 60, range: 120, resolution: 50 })
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => setContext({ page: 'analysis', lastAnalysis: method }), [setContext, method])

  function run() {
    setRunning(true)
    setDone(false)
    // Async job stand-in; real impl polls /api/v1/analysis/{job}/status
    setTimeout(() => {
      setRunning(false)
      setDone(true)
    }, 1800)
  }

  const grouped = METHODS.reduce<Record<string, typeof METHODS>>((acc, m) => {
    ;(acc[m.group] ??= []).push(m)
    return acc
  }, {})

  return (
    <>
      <PageHeader title="Analysis" subtitle="Geostatistics engine" />
      <div className="flex-1 flex min-h-0">
        {/* Method tree */}
        <aside className="w-[230px] shrink-0 border-r border-border bg-surface/30 overflow-y-auto p-4 space-y-5">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="data-label mb-2">{group}</div>
              <div className="space-y-1">
                {items.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      method === m.id
                        ? 'bg-topo/10 text-topo border border-topo/30'
                        : 'text-text-muted hover:text-text-primary hover:bg-void border border-transparent'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Config + results */}
        <div className="flex-1 overflow-y-auto p-6 grid lg:grid-cols-2 gap-6 min-w-0">
          <section>
            <div className="surface-card p-5 mb-5 flex items-start gap-3 border-topo/30 bg-topo/5">
              <span className="text-topo mt-0.5">
                <Sparkle size={18} />
              </span>
              <div>
                <div className="font-display font-semibold text-sm mb-1">AI setup wizard</div>
                <p className="text-text-muted text-sm mb-3">
                  Let TERRAX AI inspect your data stats and recommend variogram parameters and warnings
                  before you run.
                </p>
                <button
                  onClick={() => useAssistantStore.getState().setOpen(true)}
                  className="link-topo text-sm font-medium"
                >
                  Start guided setup <Arrow size={14} />
                </button>
              </div>
            </div>

            <div className="surface-card p-5 space-y-5">
              <div>
                <label className="data-label block mb-2">Variable</label>
                <select className="w-full bg-void border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-topo/50">
                  <option>copper_ppm</option>
                  <option>elevation_m</option>
                  <option>moisture_pct</option>
                </select>
              </div>

              <div>
                <label className="data-label block mb-2">Variogram model</label>
                <div className="grid grid-cols-2 gap-2">
                  {MODEL_OPTIONS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setModel(m)}
                      className={`font-mono text-xs py-2 rounded border capitalize transition-colors ${
                        model === m ? 'bg-topo text-void border-topo' : 'border-border text-text-muted hover:border-topo/40'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <VariogramPlot {...params} model={model} />

              {(['nugget', 'sill', 'range', 'resolution'] as const).map((k) => (
                <div key={k}>
                  <div className="flex justify-between mb-1">
                    <label className="data-label">{k}</label>
                    <span className="num text-sm text-topo">{params[k]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={k === 'range' ? 300 : k === 'resolution' ? 200 : 100}
                    value={params[k]}
                    onChange={(e) => setParams((p) => ({ ...p, [k]: Number(e.target.value) }))}
                    className="w-full accent-topo"
                  />
                </div>
              ))}

              <button onClick={run} disabled={running} className="btn-primary w-full">
                {running ? 'Running…' : 'Run analysis'}
              </button>
            </div>
          </section>

          {/* Results */}
          <section>
            <div className="data-label mb-3">Results</div>
            <div className="surface-card overflow-hidden min-h-[320px] flex items-center justify-center relative">
              {running && (
                <div className="text-center">
                  <svg viewBox="0 0 120 24" className="contour-loader w-40 text-topo mx-auto mb-3">
                    <path d="M4 12 Q20 2 36 12 T68 12 T100 12 T116 12" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div className="data-label">Fitting variogram · solving kriging system</div>
                </div>
              )}
              {!running && !done && <div className="data-label">Run an analysis to see results</div>}
              {done && (
                <div className="w-full h-full">
                  <div className="h-48 bg-gradient-to-br from-data via-topo/40 to-topo relative">
                    <span className="absolute bottom-2 left-2 data-label bg-void/70 px-2 py-1 rounded">
                      Interpolated surface · added to map
                    </span>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                    {[
                      ['RMSE', '7.41'],
                      ['MAE', '5.83'],
                      ['R²', '0.86'],
                    ].map(([k, v]) => (
                      <div key={k} className="p-4 text-center">
                        <div className="num text-xl font-bold">{v}</div>
                        <div className="data-label mt-1">{k}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {['GeoTIFF', 'CSV', 'Shapefile', 'PNG'].map((f) => (
                      <button key={f} className="btn-ghost !px-3 !py-1.5 text-xs">
                        Export {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
