import api from "./api"

const multipart = { headers: { "Content-Type": "multipart/form-data" } }

export const getMyVehicles = async () => (await api.get("/vehicles/my")).data
export const getAllVehicles = async (page: number, limit: number, search = "") =>
  (await api.get("/vehicles", { params: { page, limit, search } })).data
export const getVehicleById = async (id: string) =>
  (await api.get(`/vehicles/${id}`)).data
export const createVehicle = async (formData: FormData) =>
  (await api.post("/vehicles", formData, multipart)).data
export const deleteVehicle = async (id: string) =>
  (await api.delete(`/vehicles/${id}`)).data
