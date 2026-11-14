import React, { type ReactNode } from "react"
import { Logo } from "./Logo"

const FEATURES = [
  ["🚗", "Register your vehicles and keep full service history"],
  ["🛠️", "Book repairs in seconds with AI-assisted diagnosis"],
  ["📊", "Track every job from approval to completion"]
]

export const AuthLayout: React.FC<{ title: string; subtitle: string; children: ReactNode }> = ({
  title,
  subtitle,
  children
}) => (
  <div className="min-h-screen grid lg:grid-cols-2 bg-white">
    <div className="hidden lg:flex relative flex-col justify-between p-12 text-white bg-linear-to-br from-slate-900 via-indigo-900 to-brand-700 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="relative">
        <Logo light />
      </div>
      <div className="relative space-y-8 max-w-md">
        <h2 className="text-4xl font-extrabold leading-tight">
          Smarter vehicle service,<br />
          <span className="text-sky-300">from booking to handover.</span>
        </h2>
        <ul className="space-y-4">
          {FEATURES.map(([icon, text]) => (
            <li key={text} className="flex items-center gap-4 text-sm text-slate-200">
              <span className="w-10 h-10 shrink-0 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-lg">
                {icon}
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
      <p className="relative text-xs text-slate-400">© 2026 AutoCare Service Centre</p>
    </div>

    <div className="flex items-center justify-center px-6 py-12 bg-slate-50">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>
        <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500 mt-1 mb-8">{subtitle}</p>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  </div>
)
