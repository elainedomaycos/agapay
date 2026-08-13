import { useSyncExternalStore } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: number
  message: string
  type: ToastType
}

let toasts: Toast[] = []
let nextId = 1
const listeners = new Set<() => void>()
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function emit() {
  listeners.forEach((l) => l())
}

export function getToasts(): Toast[] {
  return toasts
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function dismissToast(id: number): void {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export function showToast(message: string, type: ToastType = "success", duration = 4000): void {
  const id = nextId++
  toasts = [...toasts, { id, message, type }]
  emit()
  timers.set(
    id,
    setTimeout(() => {
      dismissToast(id)
    }, duration),
  )
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, getToasts, getToasts)
}
