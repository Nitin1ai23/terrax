import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ContourField from '@/components/ContourField'
import Logo from '@/components/Logo'
import {
  Arrow,
  Crane,
  Terrain,
  Drone,
  Search,
  Layers,
  Chart,
  Cube,
  Sparkle,
  Lock,
} from '@/components/Icons'

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

/* ---------------------------------- Nav --------------------------------- */
function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-void/70 backdrop-blur-md">
      <div className="mx-auto max-w-content px-6 h-16 flex items-center justify-between">
        <Link to="/" aria-label="TERRAX home">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          <a href="#features" className="hover:text-text-primary transition-colors">
            Features
          </a>
          <a href="#geostats" className="hover:text-text-primary transition-colors">
            Models
          </a>
          <a href="#pricing" className="hover:text-text-primary transition-colors">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-text-muted hover:text-text-primary transition-colors px-3">
            Log in
          </Link>
          <Link to="/dashboard" className="btn-primary !px-5 !py-2 text-sm">
            Open app
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* --------------------------------- Hero --------------------------------- */
function Hero() {
  return (
    <header className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10">
        <ContourField className="w-full h-full" />
      </div>
      <div className="mx-auto max-w-content px-6 pt-24 pb-28 md:pt-32 md:pb-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="data-label inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-topo animate-pulse" />
            Geospatial intelligence platform
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-[0.98] mb-6">
            Real terrain.
            <br />
            <span className="text-topo">Real decisions.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-xl mb-10 leading-relaxed">
            From drone upload to kriging model to signed-off report.
            <br className="hidden md:block" /> Point-and-click. AI-guided. No scripts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dashboard" className="btn-primary">
              Upload your first dataset <Arrow size={18} />
            </Link>
            <a href="#workflow" className="btn-ghost">
              Watch demo
            </a>
          </div>
        </motion.div>
      </div>

      {/* Trusted-by strip */}
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-content px-6 py-5 flex flex-wrap items-center gap-x-10 gap-y-3">
          <span className="data-label">Trusted by survey &amp; civil teams</span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-text-muted/70 font-display font-semibold text-sm">
            <span>NORTHRIDGE CIVIL</span>
            <span>APEX AERIAL</span>
            <span>STRATA EARTHWORKS</span>
            <span>MERIDIAN SURVEY</span>
            <span>GROUNDLINE GIS</span>
          </div>
        </div>
      </div>
    </header>
  )
}

/* --------------------------- Data discovery tabs ------------------------ */
const DISCOVERY_TABS = [
  { id: 'elevation', label: 'Elevation', hint: 'DSM / DTM rasters, 1cm resolution' },
  { id: 'aerial', label: 'Aerial Photos', hint: 'Georeferenced true-color orthos' },
  { id: 'lidar', label: 'LiDAR', hint: 'Classified .las / .laz point clouds' },
  { id: 'topo', label: 'Topo Maps', hint: 'Auto contours at any interval' },
  { id: 'deeds', label: 'Deeds', hint: 'Parcel boundaries & ownership' },
] as const

function DataDiscovery() {
  const [active, setActive] = useState<(typeof DISCOVERY_TABS)[number]['id']>('elevation')
  const tab = DISCOVERY_TABS.find((t) => t.id === active)!

  return (
    <motion.section {...reveal} className="mx-auto max-w-content px-6 -mt-12 mb-28 relative z-10">
      <div className="surface-card p-6 md:p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
        <label htmlFor="discovery" className="data-label block mb-3">
          Search any location or project
        </label>
        <div className="flex items-center gap-3 border border-border rounded-md bg-void px-4 py-3 focus-within:border-topo/60 transition-colors">
          <Search className="text-text-muted shrink-0" />
          <input
            id="discovery"
            type="text"
            placeholder="Enter coordinates, address, or project name…"
            className="bg-transparent w-full outline-none text-text-primary placeholder:text-text-muted/60"
          />
          <kbd className="hidden sm:block font-mono text-xs text-text-muted border border-border rounded px-2 py-1">
            ⏎
          </kbd>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {DISCOVERY_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded transition-colors ${
                active === t.id
                  ? 'bg-topo text-void'
                  : 'border border-border text-text-muted hover:border-topo/40 hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Mini preview panel */}
        <div className="mt-5 grid md:grid-cols-[1fr_auto] gap-4 items-stretch">
          <div className="relative h-40 rounded-md overflow-hidden border border-border bg-void">
            <ContourField className="w-full h-full opacity-60" />
            <div className="absolute bottom-3 left-3 data-label bg-void/80 px-2 py-1 rounded">
              Sample layer · {tab.label}
            </div>
          </div>
          <div className="flex flex-col justify-center md:w-64">
            <div className="data-label mb-1">Layer preview</div>
            <div className="font-display font-semibold text-lg mb-1">{tab.label}</div>
            <p className="text-sm text-text-muted">{tab.hint}</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/* ----------------------------- Use case cards --------------------------- */
const USE_CASES = [
  {
    icon: Crane,
    headline: 'Monitor progress before problems cost you',
    body: 'Get up-to-date orthophotos and CAD-overlay views. Verify contractor work, catch discrepancies early, and lead site meetings with visual evidence — from the office or the field.',
    cta: 'Explore construction tools',
    pills: ['Real-time Orthophotos', 'CAD Overlay', 'Progress Tracking'],
    tag: 'Construction Sites',
  },
  {
    icon: Terrain,
    headline: 'Cut/fill volumes in minutes, not days',
    body: 'Generate terrain cross-sections and detailed volume calculations on demand. Compare design grade to actual conditions. Track material movements daily or weekly.',
    cta: 'Explore earthworks tools',
    pills: ['Cut/Fill Maps', 'Volume Billing', 'Design vs Actual'],
    tag: 'Earthworks',
  },
  {
    icon: Drone,
    headline: 'Deliver value, not file transfers',
    body: 'Process client data automatically, share results instantly. Each client gets their own secure access with permission controls. Add unlimited users at no extra cost.',
    cta: 'Explore provider tools',
    pills: ['Auto Processing', 'Client Portals', 'No Per-Seat Fees'],
    tag: 'Drone Providers',
  },
]

function UseCases() {
  return (
    <section id="features" className="mx-auto max-w-content px-6 mb-32">
      <motion.div {...reveal} className="mb-12 max-w-2xl">
        <span className="data-label">Built for the field</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">
          Three jobs. One platform. Zero scripting.
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {USE_CASES.map((c, i) => (
          <motion.article
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
            key={c.tag}
            className="surface-card p-7 flex flex-col group hover:border-topo/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-border text-topo group-hover:border-topo/50 transition-colors">
                <c.icon size={22} />
              </span>
              <span className="data-label">{c.tag}</span>
            </div>
            <h3 className="font-display font-semibold text-xl leading-snug mb-3">{c.headline}</h3>
            <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">{c.body}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {c.pills.map((p) => (
                <span
                  key={p}
                  className="font-mono text-[11px] text-text-muted border border-border rounded px-2 py-1"
                >
                  {p}
                </span>
              ))}
            </div>
            <Link to="/dashboard" className="link-topo text-sm font-medium">
              {c.cta} <Arrow size={16} />
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

/* ------------------------- Geostatistics feature grid ------------------- */
const MODELS = [
  { icon: Layers, name: 'Ordinary Kriging', desc: 'Spatial interpolation with uncertainty mapping' },
  { icon: Grid2, name: 'Indicator & Categorical', desc: 'Probabilistic threshold modeling' },
  { icon: Layers, name: 'Co-Kriging', desc: 'Multi-variable spatial estimation' },
  { icon: Chart, name: 'Geographically Weighted Regression', desc: 'Local coefficient surfaces' },
  { icon: Cube, name: 'Compositional Data Analysis', desc: 'Aitchison geometry, log-ratio transforms' },
  { icon: Cube, name: 'Space-Time Modeling', desc: '4D variogram estimation and prediction' },
  { icon: Chart, name: 'Variogram Fitting', desc: 'Automatic model selection with diagnostics' },
  { icon: Sparkle, name: 'Cross-Validation', desc: 'Jackknife / LOO with exportable metrics' },
]

function Grid2({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function GeoStats() {
  return (
    <section id="geostats" className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-content px-6 py-28">
        <motion.div {...reveal} className="mb-14 max-w-2xl">
          <span className="data-label">Geostatistics engine</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3">Every advanced model. One platform.</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
          {MODELS.map((m, i) => (
            <motion.div
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 4) * 0.06 }}
              key={m.name}
              className="group bg-void p-6 hover:bg-surface transition-colors cursor-default min-h-[160px] flex flex-col"
            >
              <div className="flex items-center justify-between mb-5 text-topo">
                <m.icon size={20} />
                <Arrow size={16} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
              <h3 className="font-display font-semibold text-[15px] leading-tight mb-2">{m.name}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- Workflow ------------------------------- */
const STEPS = [
  {
    title: 'Upload',
    body: 'Drag files or auto-process from PIX4D, DroneDeploy, Agisoft.',
  },
  { title: 'AI Setup', body: 'AI asks 4 questions, then configures the right model for you.' },
  {
    title: 'Analyze & Visualize',
    body: 'Kriging maps, 3D views, animations, cross-sections, cut/fill volumes.',
  },
  { title: 'Export & Report', body: 'Word/PDF with coefficient surfaces, diagnostics, sign-off ready.' },
]

function Workflow() {
  return (
    <section id="workflow" className="mx-auto max-w-content px-6 py-28">
      <motion.div {...reveal} className="mb-14 max-w-2xl">
        <span className="data-label">How it works</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3">From upload to boardroom in 4 steps</h2>
      </motion.div>
      <ol className="grid md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
        {STEPS.map((s, i) => (
          <motion.li
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.1 }}
            key={s.title}
            className="bg-void p-7 relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-topo text-sm border border-topo/40 rounded w-7 h-7 grid place-items-center">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className="hidden md:block text-text-muted/40">
                  <Arrow size={16} />
                </span>
              )}
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
            <p className="text-text-muted text-sm leading-relaxed">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

/* ----------------------------- Trust / proof ---------------------------- */
const STATS = [
  { value: '10,000+', label: 'projects processed' },
  { value: '< 3 min', label: 'average processing time' },
  { value: '99.7%', label: 'platform uptime' },
]

const QUOTES = [
  {
    quote:
      'We caught a 400m³ over-excavation before the invoice landed. TERRAX paid for itself on the first site.',
    name: 'Dana Okafor',
    role: 'Project Manager, Northridge Civil',
  },
  {
    quote:
      'I stopped shipping raw point clouds. Clients log into their own portal and see finished surfaces.',
    name: 'Marco Ruiz',
    role: 'Owner, Apex Aerial',
  },
  {
    quote:
      'GWR coefficient surfaces that used to take me a day in R now render in the browser with diagnostics.',
    name: 'Priya Nandakumar',
    role: 'GIS Analyst, Groundline',
  },
]

function Trust() {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-content px-6 py-24">
        <div className="grid sm:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-16">
          {STATS.map((s) => (
            <motion.div {...reveal} key={s.label} className="bg-void p-8 text-center">
              <div className="num text-4xl md:text-5xl font-bold text-topo mb-2">{s.value}</div>
              <div className="data-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {QUOTES.map((q, i) => (
            <motion.figure
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              key={q.name}
              className="surface-card p-7 flex flex-col"
            >
              <blockquote className="text-text-primary leading-relaxed flex-1 mb-5">
                “{q.quote}”
              </blockquote>
              <figcaption>
                <div className="font-display font-semibold text-sm">{q.name}</div>
                <div className="data-label mt-0.5">{q.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-2">
          <span className="data-label">Imports from</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-display font-semibold text-text-muted/70 text-sm">
            <span>PIX4D</span>
            <span>Agisoft Metashape</span>
            <span>DroneDeploy</span>
            <span>3DSurvey</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Data sources ----------------------------- */
const SOURCES = [
  { name: 'Elevation (DEM/DSM)', detail: 'Resolution down to 1cm from drone uploads' },
  { name: 'Aerial Orthophotos', detail: 'Georeferenced, stitched, true-color' },
  { name: 'LiDAR Point Clouds', detail: 'Raw .las/.laz support, classification tools' },
  { name: 'Topographic Maps', detail: 'Auto-generated contours at user-defined intervals' },
]

function DataSources() {
  return (
    <section className="mx-auto max-w-content px-6 py-28">
      <motion.div {...reveal} className="mb-14 max-w-2xl">
        <span className="data-label">Data layers</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3">High-resolution data, always current</h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 gap-6">
        {SOURCES.map((s, i) => (
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.06 }}
            key={s.name}
            className="surface-card p-7 flex items-start gap-5 hover:border-topo/40 transition-colors"
          >
            <span className="num text-topo text-xl mt-0.5">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">{s.name}</h3>
              <p className="text-text-muted text-sm">{s.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------- CTA ---------------------------------- */
function FinalCta() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 -z-10 opacity-40">
        <ContourField className="w-full h-full" />
      </div>
      <div className="mx-auto max-w-content px-6 py-28 text-center">
        <motion.div {...reveal}>
          <span className="data-label inline-flex items-center gap-2 mb-5">
            <Lock size={14} /> Secure, private workspaces
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 max-w-2xl mx-auto">
            Raw data. Real insight. Every site, every decision.
          </h2>
          <p className="text-text-muted max-w-lg mx-auto mb-9">
            Start with one dataset. No per-seat fees, no scripting, no waiting on a specialist.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Upload your first dataset <Arrow size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------------------- Footer -------------------------------- */
function Footer() {
  const cols = [
    { title: 'Product', links: ['Features', 'Solutions', 'Pricing', 'Changelog'] },
    { title: 'Developers', links: ['Docs', 'API', 'Status', 'Integrations'] },
    { title: 'Company', links: ['About', 'Careers', 'Contact'] },
  ]
  return (
    <footer className="border-t border-border bg-void">
      <div className="mx-auto max-w-content px-6 py-14">
        <div className="grid md:grid-cols-[2fr_3fr] gap-10">
          <div>
            <Logo />
            <p className="text-text-muted text-sm mt-4 max-w-xs">
              Raw data. Real insight. Every site, every decision.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="data-label mb-4">{c.title}</div>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-text-muted hover:text-topo transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4 text-text-muted text-xs">
          <span className="font-mono">© {new Date().getFullYear()} TERRAX — all rights reserved</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <div className="bg-void">
      <Nav />
      <main>
        <Hero />
        <DataDiscovery />
        <UseCases />
        <GeoStats />
        <Workflow />
        <Trust />
        <DataSources />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
