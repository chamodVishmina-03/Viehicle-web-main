export const SERVICE_TYPES: Record<string, string> = {
  GENERAL_SERVICE: "General Service",
  OIL_CHANGE: "Oil Change",
  BRAKE_REPAIR: "Brake Repair",
  ENGINE_REPAIR: "Engine Repair",
  TIRE_SERVICE: "Tire Service",
  ELECTRICAL: "Electrical",
  AC_SERVICE: "A/C Service",
  BODY_WORK: "Body Work",
  DIAGNOSTIC: "Diagnostic",
  OTHER: "Other"
}

export const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-sky-100 text-sky-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  WAITING_PARTS: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-rose-100 text-rose-700"
}

export const STATUSES = Object.keys(STATUS_STYLES)

export const money = (n: number) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(n || 0)

export const errMsg = (err: any, fallback = "Something went wrong") =>
  err?.response?.data?.error || err?.response?.data?.message || fallback
