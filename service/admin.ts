import api from "./api"

export const getStats = async () => (await api.get("/admin/stats")).data
export const getUsers = async (role = "") =>
  (await api.get("/admin/users", { params: { role } })).data
export const updateUserRoles = async (id: string, roles: string[]) =>
  (await api.patch(`/admin/users/${id}/roles`, { roles })).data
