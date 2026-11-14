import { notify } from "../lib/toast"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { deleteVehicle, getVehicleById } from "../service/vehicle"
import { LoadingSpinner } from "../components/common/LoadingSpinner"
import { StatusBadge } from "../components/common/StatusBadge"
import { Button } from "../components/common/Button"
import { SERVICE_TYPES, errMsg, money } from "../lib/constants"

export const VehicleDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVehicleById(id!)
      .then(setData)
      .catch(() => notify("Vehicle not found or access denied"))
      .finally(() => setLoading(false))
  }, [id])

  const remove = async () => {
    if (!confirm("Delete this vehicle?")) return
    try {
      await deleteVehicle(id!)
      navigate("/vehicles")
    } catch (err) {
      notify(errMsg(err, "Delete failed"))
    }
  }

  if (loading) return <LoadingSpinner />
  if (!data) return <p className="text-center py-20 text-slate-500">Vehicle not found.</p>

  const { vehicle: v, history } = data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden md:flex">
        <div className="md:w-72 h-52 md:h-auto bg-slate-100 flex items-center justify-center">
          {v.imageURL ? (
            <img src={v.imageURL} className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl">🚗</span>
          )}
        </div>
        <div className="p-6 flex-1 space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">
            {v.make} {v.vehicleModel} <span className="text-slate-400 font-normal">({v.year})</span>
          </h1>
          <span className="inline-block px-3 py-1 text-sm font-bold tracking-wider bg-slate-900 text-white rounded-md">
            {v.plateNumber}
          </span>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
            <div><dt className="text-xs text-slate-400">Fuel</dt><dd>{v.fuelType}</dd></div>
            <div><dt className="text-xs text-slate-400">Mileage</dt><dd>{v.mileage?.toLocaleString()} km</dd></div>
            <div><dt className="text-xs text-slate-400">Color</dt><dd>{v.color || "—"}</dd></div>
            <div><dt className="text-xs text-slate-400">VIN</dt><dd>{v.vin || "—"}</dd></div>
            <div><dt className="text-xs text-slate-400">Owner</dt><dd>{v.owner?.name}</dd></div>
          </dl>
          <div className="flex gap-3 pt-2">
            <Link to={`/book?vehicle=${v._id}`}>
              <Button size="sm">Book Service</Button>
            </Link>
            <Button size="sm" variant="danger" onClick={remove}>Delete</Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Service history</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl p-6 text-center">
            No service records yet.
          </p>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {history.map((j: any) => (
              <Link key={j._id} to={`/jobs/${j._id}`} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{j.title}</p>
                  <p className="text-xs text-slate-400">
                    {j.jobNumber} · {SERVICE_TYPES[j.serviceType]} · {new Date(j.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">{money(j.totalCost)}</span>
                  <StatusBadge status={j.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
