import React from "react"

export const Logo: React.FC<{ light?: boolean }> = ({ light }) => (
  <span className="inline-flex items-center gap-2.5">
    <span className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-500/30">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z" />
      </svg>
    </span>
    <span className={`text-xl font-black tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
      Auto<span className={light ? "text-sky-300" : "text-brand-500"}>Mart</span>
    </span>
  </span>
)
