export type ToastKind = "success" | "error" | "info"

// Drop-in replacement for window.alert: notify("message")
export const notify = (message: string, kind?: ToastKind) => {
  const k: ToastKind =
    kind ||
    (/fail|error|invalid|denied|required|not found|cannot|forbidden|do not match|need/i.test(message)
      ? "error"
      : /success|saved|deleted|created/i.test(message)
        ? "success"
        : "info")
  window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, kind: k } }))
}
