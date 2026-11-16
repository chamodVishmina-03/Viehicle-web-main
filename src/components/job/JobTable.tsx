import React from "react"
import { Link } from "react-router-dom"
import { StatusBadge } from "../common/StatusBadge"
import { SERVICE_TYPES, money } from "../../lib/constants"

interface Props {
  jobs: any[]
  showCustomer?: boolean
  showMechanic?: boolean
}

export const JobTable: React.FC<Props> = ({ jobs, showCustomer, showMechanic }) => {
  if (jobs.length === 0)
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
        <p className="text-slate-500 text-sm">No service jobs found.</p>
      </div>
    )

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm shadow-slate-200/60">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase font-bold">
          <tr>
            <th className="px-5 py-4">Job</th>
            <th className="px-5 py-4">Vehicle</th>
            {showCustomer && <th className="px-5 py-4">Customer</th>}
            {showMechanic && <th className="px-5 py-4">Mechanic</th>}
            <th className="px-5 py-4">Service</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Total</th>
            <th className="px-5 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((j) => (
            <tr key={j._id} className="hover:bg-slate-50 transition">
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-900">{j.jobNumber}</p>
                <p className="text-xs text-slate-400">
                  {new Date(j.createdAt).toLocaleDateString()}
                </p>
              </td>
              <td className="px-5 py-4 text-slate-700">
                {j.vehicle?.make} {j.vehicle?.vehicleModel}
                <p className="text-xs text-slate-400">{j.vehicle?.plateNumber}</p>
              </td>
              {showCustomer && (
                <td className="px-5 py-4 text-slate-600">{j.customer?.name}</td>
              )}
              {showMechanic && (
                <td className="px-5 py-4 text-slate-600">
                  {j.mechanic?.name || <span className="text-slate-300">Unassigned</span>}
                </td>
              )}
              <td className="px-5 py-4 text-slate-600">
                {SERVICE_TYPES[j.serviceType] || j.serviceType}
                {j.priority === "URGENT" && (
                  <span className="ml-2 text-[10px] font-bold text-rose-600">URGENT</span>
                )}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={j.status} />
              </td>
              <td className="px-5 py-4 text-right text-slate-700">{money(j.totalCost)}</td>
              <td className="px-5 py-4 text-right">
                <Link
                  to={`/jobs/${j._id}`}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  Open →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
