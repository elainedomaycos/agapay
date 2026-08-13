import { dismissToast, useToasts, type ToastType } from "../lib/toastStore"
import Icon from "./Icon"

const ICONS: Record<ToastType, string> = {
  success: "check",
  error: "x",
  info: "info",
  warning: "alert",
}

const ACCENT: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
}

const BADGE: Record<ToastType, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
}

export default function ToastContainer() {
  const toasts = useToasts()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed left-0 right-0 top-3 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-enter pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${ACCENT[toast.type]}`}
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${BADGE[toast.type]}`}
          >
            <Icon name={ICONS[toast.type]} size={12} strokeWidth={3} />
          </span>
          <p className="flex-1 text-sm leading-snug">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 rounded-full p-1 text-xs font-bold opacity-60 transition hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <Icon name="x" size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
