import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import Logo from '@/components/Logo'
import { Grid, Layers, Chart, Doc, Sparkle, Upload, Menu } from '@/components/Icons'
import AIAssistant from '@/components/ai/AIAssistant'
import { useAssistantStore } from '@/store/assistantStore'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: Grid },
  { to: '/map', label: 'Map', icon: Layers },
  { to: '/analysis', label: 'Analysis', icon: Chart },
  { to: '/reports', label: 'Reports', icon: Doc },
  { to: '/settings', label: 'Settings', icon: Grid },
]

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const toggleAssistant = useAssistantStore((s) => s.toggle)

  return (
    <div className="min-h-screen bg-void flex">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-[68px]' : 'w-[240px]'} shrink-0 border-r border-border bg-surface/40 flex flex-col transition-[width] duration-200`}
      >
        <div className="h-16 flex items-center px-4 border-b border-border justify-between">
          {!collapsed && (
            <Link to="/">
              <Logo size={26} />
            </Link>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="text-text-muted hover:text-topo p-1.5 rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-topo/10 text-topo border border-topo/30'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface border border-transparent'
                }`
              }
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm bg-topo/10 text-topo border border-topo/30 hover:bg-topo/20 transition-colors"
          >
            <Upload size={18} />
            {!collapsed && <span>Upload data</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>

      {/* AI assistant launcher */}
      <button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 z-40 btn-primary !rounded-full !p-4 shadow-lg"
        aria-label="Open TERRAX AI assistant"
      >
        <Sparkle size={20} />
      </button>
      <AIAssistant />
    </div>
  )
}
