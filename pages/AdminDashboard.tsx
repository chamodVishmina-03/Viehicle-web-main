import { notify } from "../lib/toast"
import React, { useEffect, useState } from "react"
import { getStats } from "../service/admin"
import { getAllJobs } from "../service/job"
import { PageHeader } from "../components/common/PageHeader"
import { JobTable } from "../components/job/JobTable"
import { Pagination } from "../components/common/Pagination"
import { StatusFilter } from "../components/common/StatusFilter"
import { LoadingSpinner } from "../components/common/LoadingSpinner"
import { SERVICE_TYPES, STATUS_STYLES, money } from "../lib/constants"

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    getStats().then(setStats).catch(() => notify("Failed to load stats"))
  }, [])

  useEffect(() => {
    setLoading(true)
    getAllJobs(page, 10, status, search)
      .then((res) => {
        setJobs(res.data)
        setTotalPages(res.meta.totalPages)
      })
      .catch(() => notify("Failed to load jobs"))
      .finally(() => setLoading(false))
  }, [page, status, search])

  const cards = stats
    ? [
        { label: "Revenue (completed)", value: money(stats.revenue) },
        { label: "Customers", value: stats.customers },
        { label: "Mechanics", value: stats.mechanics },
        { label: "Vehicles", value: stats.vehicles }
      ]
    : []

  return (
    <div className="space-y-8">
      <PageHeader title="Service Management" description="Overview of the workshop and all service jobs." />

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs text-slate-400">{c.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{c.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3">Jobs by status</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(STATUS_STYLES).map((s) => (
                  <span key={s} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${STATUS_STYLES[s]}`}>
                    {s.replace("_", " ")}: {stats.jobsByStatus[s] || 0}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3">Jobs by service type</h3>
              <div className="space-y-1.5">
                {Object.entries(stats.jobsByType).length === 0 && (
                  <p className="text-xs text-slate-400">No data yet.</p>
                )}
                {Object.entries(stats.jobsByType).map(([k, v]: any) => (
                  <div key={k} className="flex justify-between text-xs text-slate-600">
                    <span>{SERVICE_TYPES[k] || k}</span>
                    <span className="font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <h2 className="text-lg font-bold text-slate-900 mr-auto">All service jobs</h2>
          <input
            placeholder="Search job number…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
          />
          <StatusFilter value={status} onChange={(v) => { setStatus(v); setPage(1) }} />
        </div>
        {loading ? <LoadingSpinner /> : <JobTable jobs={jobs} showCustomer showMechanic />}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  )
}
