import React, { useEffect, useState } from "react"

interface Toast { id: number; message: string; kind: "success" | "error" | "info" }

const STYLE = {
  success: "bg-emerald-600",
  error: "bg-rose-600",
  info: "bg-slate-800"
}
const ICON = { success: "✓", error: "!", info: "i" }

export const ToastHost: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, kind } = (e as CustomEvent).detail
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, message, kind }])
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800)
    }
    window.addEventListener("app-toast", handler)
    return () => window.removeEventListener("app-toast", handler)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-96">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${STYLE[t.kind]} text-white text-sm rounded-xl shadow-xl px-4 py-3 flex items-start gap-3 animate-slide-in`}
        >
          <span className="w-5 h-5 shrink-0 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            {ICON[t.kind]}
          </span>
          <span className="flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
