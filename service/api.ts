import axios, { AxiosError } from "axios"
import { refreshTokenCall } from "./auth"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

const PUBLIC_ENDPOINT = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/forgot-password", "/auth/reset-password"]
const isPublicUrl = (url?: string) =>
  PUBLIC_ENDPOINT.some((p) => url?.includes(p))

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN")
  if (token && !isPublicUrl(config.url)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._isRefresh &&
      !isPublicUrl(originalRequest.url)
    ) {
      originalRequest._isRefresh = true
      try {
        const refreshToken = localStorage.getItem("REFRESH_TOKEN")
        if (!refreshToken) throw new Error("No refresh token available")

        const refreshResponse = await refreshTokenCall(refreshToken)
        const newAccessToken = refreshResponse.data.accessToken

        localStorage.setItem("ACCESS_TOKEN", newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem("ACCESS_TOKEN")
        localStorage.removeItem("REFRESH_TOKEN")
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api
