import { useEffect, useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import { Doc, Sparkle } from '@/components/Icons'
import { useAssistantStore } from '@/store/assistantStore'

const SECTIONS = [
  'Project summary',
  'Data sources and quality',
  'Variogram analysis',
  'Interpolation results (maps)',
  'Diagnostics and cross-validation',
  'Coefficient surfaces (GWR)',
  'Volume calculations',
  'Recommendations (AI-generated)',
]

export default function Reports() {
  const setContext = useAssistantStore((s) => s.setContext)
  useEffect(() => setContext({ page: 'reports' }), [setContext])

  const [selected, setSelected] = useState<Set<string>>(
    new Set(['Project summary', 'Interpolation results (maps)', 'Diagnostics and cross-validation']),
  )
  const [title, setTitle] = useState('Ridgeline Quarry — Geostatistical Assessment')

  function toggle(s: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Report builder"
        actions={
          <>
            <button className="btn-ghost !px-4 !py-2 text-sm">Export PDF</button>
            <button className="btn-primary !px-4 !py-2 text-sm">
              <Doc size={16} /> Export Word
            </button>
          </>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 grid lg:grid-cols-[360px_1fr] gap-6">
        {/* Builder */}
        <div className="space-y-6">
          <section className="surface-card p-5">
            <div className="data-label mb-3">1 · Select sections</div>
            <div className="space-y-2">
              {SECTIONS.map((s) => (
                <label key={s} className="flex items-center gap-2.5 text-sm cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={selected.has(s)}
                    onChange={() => toggle(s)}
                    className="accent-topo w-4 h-4"
                  />
                  {s}
                </label>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 space-y-4">
            <div className="data-label">2 · Configure</div>
            <div>
              <label className="data-label block mb-1.5 !text-[10px]">Report title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-void border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-topo/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="data-label block mb-1.5 !text-[10px]">Author</label>
                <input
                  defaultValue="D. Okafor"
                  className="w-full bg-void border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-topo/50"
                />
              </div>
              <div>
                <label className="data-label block mb-1.5 !text-[10px]">CRS label</label>
                <input
                  defaultValue="EPSG:32610"
                  className="w-full bg-void border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-topo/50 num"
                />
              </div>
            </div>
            <button className="btn-ghost w-full !py-2 text-sm">Upload company logo</button>
          </section>
        </div>

        {/* Live preview */}
        <section>
          <div className="data-label mb-3">3 · Preview</div>
          <div className="bg-white text-[#101418] rounded-lg p-10 shadow-2xl max-w-2xl mx-auto">
            <div className="border-b-2 border-[#101418] pb-4 mb-6">
              <div className="font-mono text-xs uppercase tracking-widest text-[#6B7F8C]">
                TERRAX · Geostatistical Report
              </div>
              <h2 className="font-display font-bold text-2xl mt-2">{title}</h2>
              <div className="font-mono text-xs mt-2 text-[#6B7F8C]">
                D. Okafor · {new Date().toLocaleDateString()} · EPSG:32610
              </div>
            </div>
            {[...selected].length === 0 && (
              <p className="text-sm text-[#6B7F8C]">Select sections to build the report.</p>
            )}
            {[...selected].map((s) => (
              <div key={s} className="mb-6">
                <h3 className="font-display font-semibold text-lg border-b border-[#E2E6EA] pb-1 mb-2">
                  {s}
                </h3>
                {s === 'Recommendations (AI-generated)' ? (
                  <div className="flex items-start gap-2 text-sm leading-relaxed">
                    <span className="text-[#0a8f5e] mt-0.5">
                      <Sparkle size={14} />
                    </span>
                    <p>
                      The spherical variogram fit (range 120 m) indicates strong spatial continuity to
                      ~120 m; sampling beyond that adds little. Cross-validation RMSE of 7.41 ppm is well
                      within tolerance for grade control. Flag the northeast block — uncertainty exceeds
                      ±10 ppm where samples thin out.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-[#3a4750]">
                    Auto-generated content with embedded maps, tables, and figures renders here on export.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
