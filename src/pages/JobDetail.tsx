import { notify } from "../lib/toast"
import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import {
  assignMechanic,
  cancelJob,
  getJobById,
  sendInvoice,
  updatePayment,
  updateCosting,
  updateJobStatus
} from "../service/job"
import { getUsers } from "../service/admin"
import { LoadingSpinner } from "../components/common/LoadingSpinner"
import { StatusBadge } from "../components/common/StatusBadge"
import { Button } from "../components/common/Button"
import { SERVICE_TYPES, errMsg, money } from "../lib/constants"

const NEXT: Record<string, string[]> = {
  PENDING: [],
  APPROVED: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_PARTS", "COMPLETED"],
  WAITING_PARTS: ["IN_PROGRESS"],
  COMPLETED: [],
  CANCELLED: []
}

export const JobDetail: React.FC = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const roles: string[] = user?.roles || []
  const isAdmin = roles.includes("ADMIN")

  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mechanics, setMechanics] = useState<any[]>([])
  const [mechanicId, setMechanicId] = useState("")
  const [parts, setParts] = useState<any[]>([])
  const [labor, setLabor] = useState("0")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [invoiceNote, setInvoiceNote] = useState("")
  const [payMethod, setPayMethod] = useState("CASH")
  const [sendReceipt, setSendReceipt] = useState(true)
  const [emailPreview, setEmailPreview] = useState("")

  const apply = (j: any) => {
    setJob(j)
    setParts(j.parts || [])
    setLabor(String(j.laborCost || 0))
    setNotes(j.mechanicNotes || "")
  }

  const reload = () =>
    getJobById(id!)
      .then(apply)
      .catch(() => notify("Job not found or access denied"))
      .finally(() => setLoading(false))

  useEffect(() => {
    reload()
    if (isAdmin) getUsers("MECHANIC").then(setMechanics).catch(() => {})
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!job) return <p className="text-center py-20 text-slate-500">Job not found.</p>

  const isAssignedMechanic = job.mechanic?._id === user?.id
  const canWork = (isAdmin || isAssignedMechanic) && !["COMPLETED", "CANCELLED"].includes(job.status)
  const isOwner = job.customer?._id === user?.id
  const canCancel =
    (isOwner && ["PENDING", "APPROVED"].includes(job.status)) ||
    (isAdmin && !["COMPLETED", "CANCELLED"].includes(job.status))

  const run = async (fn: () => Promise<any>) => {
    setSaving(true)
    try {
      await fn()
      await reload()
    } catch (err) {
      notify(errMsg(err))
    } finally {
      setSaving(false)
    }
  }

  const changeStatus = (s: string) => {
    let mileage: number | undefined
    if (s === "COMPLETED") {
      const m = prompt("Current odometer reading (km)? Leave blank to skip.")
      if (m) mileage = Number(m)
    }
    run(() => updateJobStatus(job._id, s, "", mileage))
  }

  const saveCosting = () =>
    run(() => updateCosting(job._id, { parts, laborCost: Number(labor), mechanicNotes: notes }))

  const updatePart = (i: number, k: string, v: string) =>
    setParts(parts.map((p, idx) => (idx === i ? { ...p, [k]: k === "name" ? v : Number(v) } : p)))

  const liveTotal =
    parts.reduce((s, p) => s + (p.quantity || 0) * (p.unitPrice || 0), 0) + (Number(labor) || 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400">{job.jobNumber}</p>
            <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {SERVICE_TYPES[job.serviceType]} · Priority {job.priority} ·{" "}
              {job.scheduledDate ? `Scheduled ${new Date(job.scheduledDate).toLocaleDateString()}` : "No date set"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                job.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {job.paymentStatus === "PAID" ? "PAID" : "UNPAID"}
            </span>
            <StatusBadge status={job.status} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400">Vehicle</p>
            <Link to={`/vehicles/${job.vehicle?._id}`} className="font-semibold text-brand-600 hover:underline">
              {job.vehicle?.make} {job.vehicle?.vehicleModel}
            </Link>
            <p className="text-xs text-slate-500">{job.vehicle?.plateNumber}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400">Customer</p>
            <p className="font-semibold">{job.customer?.name}</p>
            <p className="text-xs text-slate-500">{job.customer?.phone || job.customer?.email}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400">Mechanic</p>
            <p className="font-semibold">{job.mechanic?.name || "Not assigned yet"}</p>
          </div>
        </div>

        {job.description && (
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Customer description</p>
            <p className="text-sm text-slate-700 whitespace-pre-line">{job.description}</p>
          </div>
        )}
        {job.aiDiagnosis && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-bold text-indigo-900 mb-1">✨ AI preliminary diagnosis</p>
            <p className="text-xs text-indigo-900/80 whitespace-pre-line">{job.aiDiagnosis}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {canWork &&
            NEXT[job.status].map((s) => (
              <Button key={s} size="sm" disabled={saving} onClick={() => changeStatus(s)}>
                Mark {s.replace("_", " ")}
              </Button>
            ))}
          {canCancel && (
            <Button
              size="sm"
              variant="danger"
              disabled={saving}
              onClick={() => confirm("Cancel this job?") && run(() => cancelJob(job._id))}
            >
              Cancel job
            </Button>
          )}
        </div>
      </div>

      {isAdmin && !["COMPLETED", "CANCELLED"].includes(job.status) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Assign mechanic {job.status === "PENDING" && "(approves the job)"}
            </label>
            <select
              value={mechanicId}
              onChange={(e) => setMechanicId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            >
              <option value="">Select mechanic…</option>
              {mechanics.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <Button disabled={!mechanicId || saving} onClick={() => run(() => assignMechanic(job._id, mechanicId))}>
            Assign
          </Button>
        </div>
      )}

      {isAdmin && job.status !== "CANCELLED" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold text-slate-900">Payment &amp; Invoice</h2>
            <span className="text-xs text-slate-400">
              {job.invoiceSentAt ? `Invoice emailed ${new Date(job.invoiceSentAt).toLocaleString()}` : "Invoice not emailed yet"}
              {job.paidAt && ` · Paid ${new Date(job.paidAt).toLocaleDateString()} (${(job.paymentMethod || "").replace("_", " ")})`}
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600">
              Email vehicle details &amp; payment summary to {job.customer?.email}
            </label>
            <textarea
              rows={2}
              value={invoiceNote}
              onChange={(e) => setInvoiceNote(e.target.value)}
              placeholder="Optional message to the customer (e.g. vehicle is ready for collection)…"
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
            <Button
              disabled={saving}
              onClick={() =>
                run(async () => {
                  const r = await sendInvoice(job._id, invoiceNote)
                  notify(r.message, r.sent ? "success" : "info")
                  if (r.devPreview) setEmailPreview(r.devPreview)
                  setInvoiceNote("")
                })
              }
            >
              ✉️ Email invoice to customer
            </Button>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-end gap-3">
            {job.paymentStatus === "PAID" ? (
              <Button
                variant="danger"
                size="sm"
                disabled={saving}
                onClick={() => run(async () => notify((await updatePayment(job._id, { paymentStatus: "UNPAID" })).message, "info"))}
              >
                Mark as unpaid
              </Button>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank transfer</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-600 pb-3">
                  <input type="checkbox" checked={sendReceipt} onChange={(e) => setSendReceipt(e.target.checked)} />
                  Email receipt
                </label>
                <Button
                  variant="secondary"
                  disabled={saving}
                  onClick={() =>
                    run(async () =>
                      notify(
                        (await updatePayment(job._id, { paymentStatus: "PAID", paymentMethod: payMethod, sendReceipt })).message,
                        "success"
                      )
                    )
                  }
                >
                  Mark as paid
                </Button>
              </>
            )}
          </div>

          {emailPreview && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-amber-900">
                Dev preview – SMTP is not configured, so this is what the customer would receive:
              </p>
              <iframe title="email preview" srcDoc={emailPreview} sandbox="" className="w-full h-130 bg-white rounded-lg border border-amber-100" />
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-slate-900">Parts &amp; Costs</h2>

        {parts.length === 0 && !canWork && <p className="text-sm text-slate-400">No parts recorded.</p>}

        {parts.map((p, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center text-sm">
            {canWork ? (
              <>
                <input className="col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Part name" value={p.name} onChange={(e) => updatePart(i, "name", e.target.value)} />
                <input className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" type="number" min={1} value={p.quantity} onChange={(e) => updatePart(i, "quantity", e.target.value)} />
                <input className="col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" type="number" min={0} value={p.unitPrice} onChange={(e) => updatePart(i, "unitPrice", e.target.value)} />
                <button className="col-span-1 text-rose-500" onClick={() => setParts(parts.filter((_, x) => x !== i))}>✕</button>
              </>
            ) : (
              <>
                <span className="col-span-6">{p.name}</span>
                <span className="col-span-2 text-slate-500">× {p.quantity}</span>
                <span className="col-span-4 text-right">{money(p.quantity * p.unitPrice)}</span>
              </>
            )}
          </div>
        ))}

        {canWork && (
          <button className="text-xs font-semibold text-brand-600" onClick={() => setParts([...parts, { name: "", quantity: 1, unitPrice: 0 }])}>
            + Add part
          </button>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <span className="text-slate-600">Labor cost</span>
          {canWork ? (
            <input type="number" min={0} value={labor} onChange={(e) => setLabor(e.target.value)} className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-right" />
          ) : (
            <span>{money(job.laborCost)}</span>
          )}
        </div>
        <div className="flex items-center justify-between text-base font-bold">
          <span>Total</span>
          <span>{money(canWork ? liveTotal : job.totalCost)}</span>
        </div>

        {canWork ? (
          <>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Mechanic notes…" className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
            <Button onClick={saveCosting} isLoading={saving} className="w-full">Save costing &amp; notes</Button>
          </>
        ) : (
          job.mechanicNotes && (
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 whitespace-pre-line">{job.mechanicNotes}</p>
          )
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-4">Timeline</h2>
        <ol className="space-y-3">
          {[...job.statusHistory].reverse().map((h: any, i: number) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <div>
                <StatusBadge status={h.status} />
                <span className="ml-2 text-xs text-slate-400">
                  {new Date(h.at).toLocaleString()} {h.changedBy?.name && `· ${h.changedBy.name}`}
                </span>
                {h.note && <p className="text-xs text-slate-500 mt-1">{h.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
