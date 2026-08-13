import { useSyncExternalStore } from "react"
import type { Appointment } from "../types"
import { MOCK_APPOINTMENTS } from "../data/mockData"

const STORAGE_KEY = "agapay.appointments"

function loadInitial(): Appointment[] {
  if (typeof window === "undefined") return [...MOCK_APPOINTMENTS]
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...MOCK_APPOINTMENTS]
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...MOCK_APPOINTMENTS]
    return parsed as Appointment[]
  } catch {
    return [...MOCK_APPOINTMENTS]
  }
}

let appointments: Appointment[] = loadInitial()
const listeners = new Set<() => void>()

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  } catch {
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

export function getAppointments(): Appointment[] {
  return appointments
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function addAppointment(appointment: Appointment): void {
  appointments = [appointment, ...appointments]
  persist()
  emit()
}

export function updateAppointment(
  id: string,
  patch: Partial<Appointment>,
): void {
  appointments = appointments.map((a) => (a.id === id ? { ...a, ...patch } : a))
  persist()
  emit()
}

export function cancelAppointment(id: string): void {
  updateAppointment(id, { status: "cancelled" })
}

export function getAppointmentById(id: string): Appointment | undefined {
  return appointments.find((a) => a.id === id)
}

export function useAppointments(): Appointment[] {
  return useSyncExternalStore(subscribe, getAppointments, getAppointments)
}

export function upcomingAppointments(list: Appointment[]): Appointment[] {
  return list.filter((a) => a.status === "confirmed" || a.status === "pending")
}

export function pastAppointments(list: Appointment[]): Appointment[] {
  return list.filter(
    (a) => a.status === "completed" || a.status === "cancelled",
  )
}
