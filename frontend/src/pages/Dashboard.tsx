import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/layout/PageHeader'
import ContourField from '@/components/ContourField'
import { Upload, Arrow, Chart } from '@/components/Icons'
import { useAssistantStore } from '@/store/assistantStore'
import type { Project } from '@/types'

const STATS = [
  { label: 'Active projects', value: '6' },
  { label: 'Storage used', value: '142 GB' },
  { label: 'Jobs running', value: '2' },
]

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Ridgeline Quarry — June', status: 'ready', datasetCount: 4, updatedAt: '2h ago' },
  { id: 'p2', name: 'Maple St Subdivision', status: 'processing', datasetCount: 2, updatedAt: '12m ago' },
  { id: 'p3', name: 'Highway 9 Earthworks', status: 'ready', datasetCount: 7, updatedAt: '1d ago' },
  { id: 'p4', name: 'Coastal Survey Block C', status: 'error', datasetCount: 1, updatedAt: '3d ago' },
]

const RECENT_ANALYSES = [
  { name: 'Ordinary Kriging — copper ppm', project: 'Ridgeline Quarry', when: '2h ago' },
  { name: 'Cut/Fill — design vs actual', project: 'Highway 9 Earthworks', when: '5h ago' },
  { name: 'GWR — settlement vs load', project: 'Maple St Subdivision', when: '1d ago' },
]

const statusStyles: Record<Project['status'], string> = {
  ready: 'text-topo border-topo/40',
  processing: 'text-data border-data/40',
  error: 'text-data border-data/40',
}

export default function Dashboard() {
  const setContext = useAssistantStore((s) => s.setContext)
  useEffect(() => setContext({ page: 'dashboard' }), [setContext])

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Workspace overview"
        actions={
          <Link to="/map" className="btn-primary !px-5 !py-2 text-sm">
            <Upload size={16} /> New project
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats bar */}
        <div className="grid sm:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface p-6">
              <div className="num text-3xl font-bold mb-1">{s.value}</div>
              <div className="data-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Recent projects</h2>
              <Link to="/map" className="link-topo text-sm">
                View all <Arrow size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {PROJECTS.map((p) => (
                <Link
                  key={p.id}
                  to="/map"
                  className="surface-card p-4 flex items-center gap-4 hover:border-topo/40 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden border border-border bg-void shrink-0">
                    <ContourField className="w-full h-full opacity-70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate group-hover:text-topo transition-colors">
                      {p.name}
                    </div>
                    <div className="data-label mt-1">{p.datasetCount} datasets · {p.updatedAt}</div>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${statusStyles[p.status]}`}
                  >
                    {p.status}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent analyses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Recent analyses</h2>
              <Link to="/analysis" className="link-topo text-sm">
                Open analysis <Arrow size={14} />
              </Link>
            </div>
            <div className="surface-card divide-y divide-border">
              {RECENT_ANALYSES.map((a) => (
                <Link
                  key={a.name}
                  to="/analysis"
                  className="flex items-center gap-3 p-4 hover:bg-void transition-colors group"
                >
                  <span className="text-topo">
                    <Chart size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate group-hover:text-topo transition-colors">
                      {a.name}
                    </div>
                    <div className="data-label mt-0.5">{a.project}</div>
                  </div>
                  <span className="data-label">{a.when}</span>
                </Link>
              ))}
            </div>

            <div className="surface-card mt-6 p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <ContourField className="w-full h-full" />
              </div>
              <div className="relative">
                <h3 className="font-display font-semibold mb-2">Not sure where to start?</h3>
                <p className="text-text-muted text-sm mb-4">
                  Tell TERRAX AI about your dataset and goal — it recommends the right model and pre-fills
                  the parameters.
                </p>
                <button
                  onClick={() => useAssistantStore.getState().setOpen(true)}
                  className="btn-ghost !px-4 !py-2 text-sm"
                >
                  Ask the assistant
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
