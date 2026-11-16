import { notify } from "../lib/toast"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createVehicle } from "../service/vehicle"
import { PageHeader } from "../components/common/PageHeader"
import { InputField } from "../components/forms/InputField"
import { Button } from "../components/common/Button"
import { errMsg } from "../lib/constants"
import { compressImage } from "../lib/image"


export const AddVehicle: React.FC = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    make: "",
    vehicleModel: "",
    year: String(new Date().getFullYear()),
    plateNumber: "",
    vin: "",
    color: "",
    fuelType: "PETROL",
    mileage: ""
  })
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<any>) =>
    setForm({ ...form, [k]: e.target.value })

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith("image/")) return notify("Please select an image")
    const small = await compressImage(f)
    setImage(small)
    setPreview(URL.createObjectURL(small))
  }

  const submit = async () => {
    if (!form.make || !form.vehicleModel || !form.year || !form.plateNumber)
      return notify("Make, model, year and plate number are required")
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append("image", image)
      const v = await createVehicle(fd)
      navigate(`/vehicles/${v._id}`)
    } catch (err) {
      notify(errMsg(err, "Failed to add vehicle"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader title="Add Vehicle" description="Enter the vehicle details exactly as registered." />
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Make *" placeholder="Toyota" value={form.make} onChange={set("make")} />
          <InputField label="Model *" placeholder="Corolla" value={form.vehicleModel} onChange={set("vehicleModel")} />
          <InputField label="Year *" type="number" value={form.year} onChange={set("year")} />
          <InputField label="Plate Number *" placeholder="CAB-1234" value={form.plateNumber} onChange={set("plateNumber")} />
          <InputField label="VIN" value={form.vin} onChange={set("vin")} />
          <InputField label="Color" value={form.color} onChange={set("color")} />
          <InputField label="Mileage (km)" type="number" value={form.mileage} onChange={set("mileage")} />
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Fuel Type</label>
            <select
              value={form.fuelType}
              onChange={set("fuelType")}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            >
              {["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "OTHER"].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Photo</label>
          <input type="file" accept="image/*" onChange={onFile} className="text-xs" />
          {preview && <img src={preview} className="mt-3 h-40 rounded-xl object-cover" />}
        </div>

        <Button onClick={submit} isLoading={submitting} className="w-full">
          Save Vehicle
        </Button>
      </div>
    </div>
  )
}
