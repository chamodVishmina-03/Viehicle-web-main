import { notify } from "../lib/toast"
import React, { useEffect, useState } from "react"
import { getMyVehicles } from "../service/vehicle"
import { PageHeader } from "../components/common/PageHeader"
import { VehicleCard } from "../components/vehicle/VehicleCard"
import { LoadingSpinner } from "../components/common/LoadingSpinner"

export const MyVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyVehicles()
      .then(setVehicles)
      .catch(() => notify("Failed to load vehicles"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Vehicles"
        description="Register and manage the vehicles you bring in for service."
        actionLabel="+ Add Vehicle"
        actionLink="/vehicles/new"
      />
      {loading ? (
        <LoadingSpinner />
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500 text-sm">No vehicles registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v._id} item={v} />
          ))}
        </div>
      )}
    </div>
  )
}
