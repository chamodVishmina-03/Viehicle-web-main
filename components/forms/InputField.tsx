import React, { type InputHTMLAttributes } from "react"

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, className = "", ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>}
    <input
      className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-4 transition ${
        error
          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
          : "border-slate-200 focus:border-brand-500 focus:ring-brand-500/10"
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-[11px] text-rose-500 font-medium">{error}</p>}
  </div>
)
