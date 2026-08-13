import { useSyncExternalStore } from "react"
import type {
  AdminDoctor,
  AdminService,
  StaffMember,
  PatientRecord,
  ClinicProfile,
} from "../types"
import {
  ADMIN_DOCTORS,
  ADMIN_SERVICES,
  ADMIN_STAFF,
  ADMIN_PATIENTS,
  ADMIN_CLINIC_PROFILE,
} from "../data/adminData"

let doctors: AdminDoctor[] = ADMIN_DOCTORS.map((d) => ({
  ...d,
  schedule: d.schedule.map((s) => ({ ...s })),
}))
let services: AdminService[] = ADMIN_SERVICES.map((s) => ({
  ...s,
  doctorIds: [...s.doctorIds],
}))
let staff: StaffMember[] = ADMIN_STAFF.map((s) => ({ ...s }))
let patients: PatientRecord[] = ADMIN_PATIENTS.map((p) => ({
  ...p,
  appointmentIds: [...p.appointmentIds],
}))
let clinicProfile: ClinicProfile = { ...ADMIN_CLINIC_PROFILE }

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/* ── Doctors ── */

export function getAdminDoctors(): AdminDoctor[] {
  return doctors
}

export function useAdminDoctors(): AdminDoctor[] {
  return useSyncExternalStore(subscribe, getAdminDoctors, getAdminDoctors)
}

export function addAdminDoctor(doctor: AdminDoctor): void {
  doctors = [doctor, ...doctors]
  emit()
}

export function updateAdminDoctor(id: string, patch: Partial<AdminDoctor>): void {
  doctors = doctors.map((d) => (d.id === id ? { ...d, ...patch } : d))
  emit()
}

export function toggleAdminDoctor(id: string): void {
  doctors = doctors.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
  emit()
}

/* ── Services ── */

export function getAdminServices(): AdminService[] {
  return services
}

export function useAdminServices(): AdminService[] {
  return useSyncExternalStore(subscribe, getAdminServices, getAdminServices)
}

export function addAdminService(service: AdminService): void {
  services = [service, ...services]
  emit()
}

export function updateAdminService(id: string, patch: Partial<AdminService>): void {
  services = services.map((s) => (s.id === id ? { ...s, ...patch } : s))
  emit()
}

export function toggleAdminService(id: string): void {
  services = services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
  emit()
}

/* ── Staff ── */

export function getStaff(): StaffMember[] {
  return staff
}

export function useStaff(): StaffMember[] {
  return useSyncExternalStore(subscribe, getStaff, getStaff)
}

export function addStaffMember(member: StaffMember): void {
  staff = [member, ...staff]
  emit()
}

export function updateStaffMember(id: string, patch: Partial<StaffMember>): void {
  staff = staff.map((s) => (s.id === id ? { ...s, ...patch } : s))
  emit()
}

export function toggleStaffMember(id: string): void {
  staff = staff.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
  emit()
}

/* ── Patients ── */

export function getPatients(): PatientRecord[] {
  return patients
}

export function usePatients(): PatientRecord[] {
  return useSyncExternalStore(subscribe, getPatients, getPatients)
}

export function addPatient(patient: PatientRecord): void {
  patients = [patient, ...patients]
  emit()
}

export function updatePatient(id: string, patch: Partial<PatientRecord>): void {
  patients = patients.map((p) => (p.id === id ? { ...p, ...patch } : p))
  emit()
}

/* ── Clinic Profile ── */

export function getClinicProfile(): ClinicProfile {
  return clinicProfile
}

export function useClinicProfile(): ClinicProfile {
  return useSyncExternalStore(subscribe, getClinicProfile, getClinicProfile)
}

export function updateClinicProfile(patch: Partial<ClinicProfile>): void {
  clinicProfile = { ...clinicProfile, ...patch }
  emit()
}
