import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getMyJobs, getAssignedJobs } from "../service/job"
import { JobTable } from "../components/job/JobTable"
import { LoadingSpinner } from "../components/common/LoadingSpinner"

export const Home: React.FC = () => {
  const { user } = useAuth()
  const roles: string[] = user?.roles || []
  const isMechanic = roles.includes("MECHANIC")
  const isAdmin = roles.includes("ADMIN")
  const isCustomer = roles.includes("CUSTOMER")

  const [jobs, setJobs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = isMechanic && !isCustomer ? getAssignedJobs : getMyJobs
    load(1, 5)
      .then((res) => {
        setJobs(res.data)
        setTotal(res.meta?.total || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const actions = [
    { to: "/book", label: "Book a Service", hint: "Schedule a repair", icon: "🛠️", tint: "from-blue-500 to-indigo-500", show: isCustomer || isAdmin },
    { to: "/vehicles/new", label: "Add Vehicle", hint: "Register a new car", icon: "🚗", tint: "from-emerald-500 to-teal-500", show: isCustomer || isAdmin },
    { to: "/jobs/assigned", label: "My Assignments", hint: "Jobs assigned to you", icon: "📋", tint: "from-amber-500 to-orange-500", show: isMechanic || isAdmin },
    { to: "/admin", label: "Admin Console", hint: "Stats & job control", icon: "📊", tint: "from-fuchsia-500 to-purple-600", show: isAdmin }
  ].filter((a) => a.show)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-indigo-900 to-brand-700 text-white p-8 sm:p-12 shadow-xl shadow-indigo-900/10">
        <div className="absolute -top-20 -right-10 w-80 h-80 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute right-8 bottom-4 text-8xl opacity-10 select-none">🔧</div>
        <div className="relative">
          <p className="text-sky-300 text-sm font-semibold">{greeting}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">{user?.name}</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mt-3">
            Manage vehicles, book repairs and follow every service job in real time.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-2.5">
            <span className="text-2xl font-extrabold">{total}</span>
            <span className="text-xs text-slate-200 leading-tight">service jobs<br />on your account</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-0.5 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${a.tint} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition`}>
              {a.icon}
            </div>
            <p className="text-sm font-bold text-slate-900 mt-4">{a.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{a.hint}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Recent service jobs</h2>
        {loading ? <LoadingSpinner /> : <JobTable jobs={jobs} showMechanic={!isMechanic} showCustomer={isMechanic} />}
      </div>
    </div>
  )
}
