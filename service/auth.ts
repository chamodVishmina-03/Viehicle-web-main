import api from "./api"

export const login = async (email: string, password: string) =>
  (await api.post("/auth/login", { email, password })).data

export const register = async (
  name: string,
  email: string,
  phone: string,
  password: string
) => (await api.post("/auth/register", { name, email, phone, password })).data

export const getMyDetails = async () => (await api.get("/auth/me")).data

export const refreshTokenCall = async (refreshToken: string) =>
  (await api.post("/auth/refresh", { refreshToken })).data

export const forgotPassword = async (email: string) =>
  (await api.post("/auth/forgot-password", { email })).data

export const resetPassword = async (token: string, password: string) =>
  (await api.post("/auth/reset-password", { token, password })).data

export const updateMyProfile = async (payload: {
  name?: string
  phone?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}) => (await api.patch("/auth/me", payload)).data
