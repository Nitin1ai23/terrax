import { useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import { useAssistantStore } from '@/store/assistantStore'

export default function Settings() {
  const setContext = useAssistantStore((s) => s.setContext)
  useEffect(() => setContext({ page: 'settings' }), [setContext])

  return (
    <>
      <PageHeader title="Settings" subtitle="Workspace preferences" />
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
        <section className="surface-card p-6 mb-6">
          <div className="data-label mb-4">Account</div>
          <div className="space-y-4">
            <div>
              <label className="data-label block mb-1.5 !text-[10px]">Display name</label>
              <input
                defaultValue="Dana Okafor"
                className="w-full bg-void border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-topo/50"
              />
            </div>
            <div>
              <label className="data-label block mb-1.5 !text-[10px]">Default CRS</label>
              <input
                defaultValue="EPSG:32610"
                className="w-full bg-void border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-topo/50 num"
              />
            </div>
          </div>
        </section>

        <section className="surface-card p-6">
          <div className="data-label mb-4">AI assistant</div>
          <label className="flex items-center justify-between text-sm py-2">
            Enable AI setup recommendations
            <input type="checkbox" defaultChecked className="accent-topo w-4 h-4" />
          </label>
          <label className="flex items-center justify-between text-sm py-2">
            Include AI interpretation in reports
            <input type="checkbox" defaultChecked className="accent-topo w-4 h-4" />
          </label>
        </section>
      </div>
    </>
  )
}
