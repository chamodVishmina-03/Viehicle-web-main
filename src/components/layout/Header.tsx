import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Logo } from "./Logo"

export const Header: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const roles: string[] = user?.roles || []
  const isAdmin = roles.includes("ADMIN")
  const isMechanic = roles.includes("MECHANIC")
  const isCustomer = roles.includes("CUSTOMER")

  const links: { to: string; label: string }[] = [{ to: "/", label: "Dashboard" }]
  if (isCustomer || isAdmin) {
    links.push({ to: "/vehicles", label: "Vehicles" })
    links.push({ to: "/jobs/my", label: "My Services" })
  }
  if (isMechanic || isAdmin) links.push({ to: "/jobs/assigned", label: "Assignments" })
  if (isAdmin) {
    links.push({ to: "/admin", label: "Admin" })
    links.push({ to: "/admin/users", label: "Users" })
  }

  const logout = () => {
    localStorage.removeItem("ACCESS_TOKEN")
    localStorage.removeItem("REFRESH_TOKEN")
    window.location.href = "/login"
  }

  const pill = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 text-sm font-medium rounded-lg transition ${
      isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`

  const initials = (user?.name || "?").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase()

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate("/")} className="cursor-pointer">
            <Logo />
          </button>
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={pill}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {(isCustomer || isAdmin) && (
            <NavLink
              to="/book"
              className="px-4 py-2 bg-linear-to-r from-brand-500 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-500/25 hover:-translate-y-px transition"
            >
              + Book Service
            </NavLink>
          )}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <button
              onClick={() => navigate("/profile")}
              title="My profile"
              className="flex items-center gap-3 cursor-pointer text-left hover:opacity-80 transition"
            >
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-slate-700 to-slate-900 text-white text-xs font-bold flex items-center justify-center">
                {initials}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{roles.join(" · ")}</p>
              </div>
            </button>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.8 12H4m0 0l3-3m-3 3l3 3M10 5V4a1 1 0 011-1h7a1 1 0 011 1v16a1 1 0 01-1 1h-7a1 1 0 01-1-1v-1" />
              </svg>
            </button>
          </div>
        </div>

        <button className="lg:hidden p-2 text-slate-600" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1 shadow-lg">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end onClick={() => setOpen(false)} className={pill}>
              {l.label}
            </NavLink>
          ))}
          {(isCustomer || isAdmin) && (
            <NavLink to="/book" onClick={() => setOpen(false)} className="block px-3.5 py-2 text-sm font-semibold text-brand-600">
              + Book Service
            </NavLink>
          )}
          <div className="pt-3 mt-2 border-t border-slate-100 flex justify-between items-center">
            <button onClick={() => { setOpen(false); navigate("/profile") }} className="text-xs font-bold">{user?.name} · Profile</button>
            <button onClick={logout} className="text-xs font-semibold text-rose-600">Logout</button>
          </div>
        </div>
      )}
    </header>
  )
}
