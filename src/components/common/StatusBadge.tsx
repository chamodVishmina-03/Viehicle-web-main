import React from "react"
import { STATUS_STYLES } from "../../lib/constants"

const DOT: Record<string, string> = {
  PENDING: "bg-amber-500",
  APPROVED: "bg-sky-500",
  IN_PROGRESS: "bg-blue-500 animate-pulse",
  WAITING_PARTS: "bg-orange-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-rose-500"
}

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${DOT[status] || "bg-slate-400"}`} />
    {status?.replace("_", " ")}
  </span>
)
