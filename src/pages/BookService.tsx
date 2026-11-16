import { notify } from "../lib/toast"
import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { getMyVehicles } from "../service/vehicle"
import { createJob, generateDiagnosis } from "../service/job"
import { PageHeader } from "../components/common/PageHeader"
import { InputField } from "../components/forms/InputField"
import { Button } from "../components/common/Button"
import { SERVICE_TYPES, errMsg } from "../lib/constants"

export const BookService: React.FC = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [form, setForm] = useState({
    vehicleId: params.get("vehicle") || "",
    serviceType: "GENERAL_SERVICE",
    title: "",
    description: "",
    priority: "NORMAL",
    scheduledDate: ""
  })
  const [aiDiagnosis, setAiDiagnosis] = useState("")
  const [generating, setGenerating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getMyVehicles().then((list) => {
      setVehicles(list)
      if (!form.vehicleId && list[0]) setForm((f) => ({ ...f, vehicleId: list[0]._id }))
    })
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<any>) =>
    setForm({ ...form, [k]: e.target.value })

  const selected = vehicles.find((v) => v._id === form.vehicleId)

  const handleAI = async () => {
    if (!form.description.trim()) return notify("Describe the problem first")
    setGenerating(true)
    try {
      const info = selected
        ? `${selected.year} ${selected.make} ${selected.vehicleModel}, ${selected.mileage} km, ${selected.fuelType}`
        : "Unknown vehicle"
      const res = await generateDiagnosis(info, form.description)
      setAiDiagnosis(res.diagnosis)
    } catch (err) {
      notify(errMsg(err, "AI diagnosis failed"))
    } finally {
      setGenerating(false)
    }
  }

  const submit = async () => {
    if (!form.vehicleId || !form.title.trim()) return notify("Vehicle and title are required")
    setSubmitting(true)
    try {
      const job = await createJob({ ...form, aiDiagnosis })
      navigate(`/jobs/${job._id}`)
    } catch (err) {
      notify(errMsg(err, "Failed to create booking"))
    } finally {
      setSubmitting(false)
    }
  }

  if (vehicles.length === 0)
    return (
      <div className="max-w-xl mx-auto text-center py-20 bg-white border border-slate-200 rounded-2xl space-y-4">
        <p className="text-slate-600 text-sm">You need to register a vehicle before booking a service.</p>
        <Button onClick={() => navigate("/vehicles/new")}>Add Vehicle</Button>
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader title="Book a Service" description="Tell us what your vehicle needs." />
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Vehicle</label>
          <select value={form.vehicleId} onChange={set("vehicleId")} className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10">
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.make} {v.vehicleModel} — {v.plateNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Service type</label>
            <select value={form.serviceType} onChange={set("serviceType")} className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10">
              {Object.entries(SERVICE_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
            <select value={form.priority} onChange={set("priority")} className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10">
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <InputField label="Title *" placeholder="e.g. Squeaking noise when braking" value={form.title} onChange={set("title")} />

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Problem description</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={set("description")}
            placeholder="Describe symptoms, when they started, warning lights..."
            className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none focus:border-brand-500"
          />
        </div>

        <InputField label="Preferred date" type="date" value={form.scheduledDate} onChange={set("scheduledDate")} />

        <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-indigo-900">✨ AI preliminary diagnosis</p>
            <Button size="sm" variant="secondary" onClick={handleAI} isLoading={generating}>
              Generate
            </Button>
          </div>
          {aiDiagnosis && (
            <textarea
              rows={6}
              value={aiDiagnosis}
              onChange={(e) => setAiDiagnosis(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-indigo-100 rounded-lg"
            />
          )}
        </div>

        <Button onClick={submit} isLoading={submitting} className="w-full">
          Submit Booking
        </Button>
      </div>
    </div>
  )
}
