import React from "react"
import { Link } from "react-router-dom"

export const VehicleCard: React.FC<{ item: any }> = ({ item }) => (
  <Link
    to={`/vehicles/${item._id}`}
    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-0.5 transition-all"
  >
    <div className="h-44 bg-linear-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center relative">
      {item.imageURL ? (
        <img src={item.imageURL} alt={item.plateNumber} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
      ) : (
        <span className="text-6xl opacity-70">🚗</span>
      )}
      <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold tracking-widest bg-slate-900/90 text-white rounded-md backdrop-blur">
        {item.plateNumber}
      </span>
    </div>
    <div className="p-5">
      <h2 className="font-bold text-slate-900 group-hover:text-brand-600 transition">
        {item.make} {item.vehicleModel}
      </h2>
      <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] font-medium text-slate-600">
        <span className="px-2 py-1 bg-slate-100 rounded-md">{item.year}</span>
        <span className="px-2 py-1 bg-slate-100 rounded-md">{item.fuelType}</span>
        <span className="px-2 py-1 bg-slate-100 rounded-md">{item.mileage?.toLocaleString()} km</span>
      </div>
      {item.owner?.name && <p className="text-xs text-slate-400 mt-3">Owner: {item.owner.name}</p>}
    </div>
  </Link>
)
