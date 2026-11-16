import api from "./api"

export const createJob = async (payload: any) =>
  (await api.post("/jobs", payload)).data
export const getMyJobs = async (page = 1, limit = 10, status = "") =>
  (await api.get("/jobs/my", { params: { page, limit, status } })).data
export const getAssignedJobs = async (page = 1, limit = 10, status = "") =>
  (await api.get("/jobs/assigned", { params: { page, limit, status } })).data
export const getAllJobs = async (page = 1, limit = 10, status = "", search = "") =>
  (await api.get("/jobs/admin/all", { params: { page, limit, status, search } })).data
export const getJobById = async (id: string) => (await api.get(`/jobs/${id}`)).data
export const cancelJob = async (id: string, note?: string) =>
  (await api.patch(`/jobs/${id}/cancel`, { note })).data
export const assignMechanic = async (id: string, mechanicId: string) =>
  (await api.patch(`/jobs/${id}/assign`, { mechanicId })).data
export const updateJobStatus = async (id: string, status: string, note = "", mileage?: number) =>
  (await api.patch(`/jobs/${id}/status`, { status, note, mileage })).data
export const updateCosting = async (id: string, payload: any) =>
  (await api.patch(`/jobs/${id}/costing`, payload)).data
export const generateDiagnosis = async (vehicleInfo: string, symptoms: string) =>
  (
    await api.post(
      "/jobs/generate-diagnosis",
      { vehicleInfo, symptoms },
      { timeout: 45000 } // stop the spinner if the server never answers
    )
  ).data
export const sendInvoice = async (id: string, note = "") =>
  (await api.post(`/jobs/${id}/send-invoice`, { note })).data
export const updatePayment = async (
  id: string,
  payload: { paymentStatus: "PAID" | "UNPAID"; paymentMethod?: string; sendReceipt?: boolean }
) => (await api.patch(`/jobs/${id}/payment`, payload)).data