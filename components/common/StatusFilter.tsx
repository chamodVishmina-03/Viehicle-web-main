import React from "react"
import { STATUSES } from "../../lib/constants"

interface Props {
  value: string
  onChange: (v: string) => void
}

export const StatusFilter: React.FC<Props> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
  >
    <option value="">All statuses</option>
    {STATUSES.map((s) => (
      <option key={s} value={s}>
        {s.replace("_", " ")}
      </option>
    ))}
  </select>
)
