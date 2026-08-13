export type Screen = "landing" | "login" | "register" | "otp" | "welcome" | "chat" | "history" | "appointments" | "appointment-detail" | "profile" | "settings" | "role-select" | "admin-login" | "admin-dashboard" | "admin-appointments" | "admin-calendar" | "admin-doctors" | "admin-services" | "admin-patients" | "admin-clinic" | "admin-visibility" | "admin-analytics" | "admin-staff"

export type Intent = "FIND_CARE" | "BOOK_APPOINTMENT" | "VIEW_APPOINTMENT" | "VIEW_RECORD" | "VIEW_QR" | "VIEW_QUEUE" | "GENERAL_HELP" | "CONFIRM_BOOKING" | "SHOW_OPTIONS"

export type MessageRole = "user" | "assistant"

export type CardType = "clinic" | "clinic_list" | "clinic_detail" | "appointment" | "health_record" | "qr_code" | "queue" | "booking_confirm" | "booking_review" | "doctor_select" | "service_select" | "date_select" | "slot_select" | "options"

export interface OptionItem {
  label: string
  icon?: string
  value: string
}

export interface CardAction {
  type: string
  label: string
  data?: Record<string, unknown>
}

export interface MessageCard {
  type: CardType
  data?: Record<string, unknown>
  options?: OptionItem[]
  actions?: CardAction[]
}

export interface ChatMessage {
  id: string
  role: MessageRole
  text: string
  card?: MessageCard
  suggestions?: string[]
  timestamp: Date
}

export interface ConversationSummary {
  id: string
  title: string
  preview: string
  date: string
  dateLabel: string
}

export interface User {
  id: string
  name: string
  firstName: string
  agapayId: string
  mobile: string
  email: string
  dateOfBirth: string
  avatarInitials: string
}

export type TimePref = "morning" | "afternoon" | "evening" | "any"

export interface Service {
  id: string
  name: string
  duration: string
  price: number
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  clinicId: string
  title?: string
  years?: number
}

export interface OperatingHour {
  day: string
  hours: string
}

export interface Clinic {
  id: string
  name: string
  specialty: string
  specialtyKeys: string[]
  city: string
  address: string
  distanceKm: number
  distance: string
  isOpen: boolean
  nextAvailable: string
  rating: number
  image: string
  description: string
  operatingHours: OperatingHour[]
  consultationFee: number
  services: Service[]
  doctors: Doctor[]
  slots: string[]
}

export interface DateOption {
  key: string
  label: string
  sub: string
}

export type BookingStep = "idle" | "collecting" | "results" | "clinic" | "doctor" | "service" | "date" | "slot" | "review" | "confirmed"

export interface BookingSession {
  active: boolean
  step: BookingStep
  specialty?: string
  specialtyLabel?: string
  location?: string
  timePref?: TimePref
  datePref?: string
  clinics: Clinic[]
  clinic?: Clinic
  doctor?: Doctor
  service?: Service
  date?: DateOption
  slot?: string
}

export type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled"

export type BookingSource = "AGAPAY" | "Phone" | "Walk-in" | "Online"

export interface Appointment {
  id: string
  doctorName: string
  doctorId?: string
  specialty: string
  clinicName: string
  clinicAddress?: string
  patientName?: string
  service: string
  fee: number
  dateLabel: string
  time: string
  status: AppointmentStatus
  reminder?: boolean
  source?: BookingSource
}

export interface HealthRecord {
  id: string
  type: string
  doctorName: string
  clinicName: string
  date: string
  notes?: string
}

export interface QueueInfo {
  clinicName: string
  yourNumber: string
  nowServing: string
  estimatedWait: string
}

export interface AppSettings {
  seniorMode: boolean
  language: "English" | "Filipino" | "Bicolano"
  highContrast: boolean
  voiceAssistance: boolean
  notifications: boolean
  textSize: "normal" | "large" | "xlarge"
}

/* ── Clinic Admin (Sprint 3–5) ── */

export type AdminRole = "admin" | "receptionist" | "doctor"

export interface AvailabilityBlock {
  day: string
  start: string
  end: string
}

export interface AdminDoctor {
  id: string
  name: string
  specialty: string
  title: string
  years: number
  email: string
  phone: string
  active: boolean
  schedule: AvailabilityBlock[]
}

export interface AdminService {
  id: string
  name: string
  duration: string
  price: number
  doctorIds: string[]
  active: boolean
}

export interface StaffMember {
  id: string
  name: string
  role: AdminRole
  email: string
  phone: string
  active: boolean
}

export interface PatientRecord {
  id: string
  name: string
  age: number
  gender: "Female" | "Male" | "Other"
  contact: string
  lastVisit: string
  appointmentIds: string[]
}

export interface ClinicProfile {
  name: string
  specialty: string
  city: string
  address: string
  phone: string
  description: string
  image: string
  consultationFee: number
  openTime: string
  closeTime: string
}

export interface AnalyticsDatum {
  label: string
  value: number
}

export interface SourceDatum {
  label: BookingSource
  value: number
  color: string
}
