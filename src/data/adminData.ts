import type {
  AdminDoctor,
  AdminService,
  StaffMember,
  PatientRecord,
  ClinicProfile,
  AnalyticsDatum,
  SourceDatum,
  AvailabilityBlock,
} from "../types"

export const ADMIN_CLINIC_PROFILE: ClinicProfile = {
  name: "ABC Dermatology Clinic",
  specialty: "Dermatology",
  city: "Batangas City",
  address: "Rizal Ave. cor. P. Herrera St., Batangas City",
  phone: "(043) 702-1123",
  description:
    "A trusted skin-care clinic in Batangas City specializing in medical and cosmetic dermatology — from acne and eczema to skin-cancer screening.",
  image: "droplets",
  consultationFee: 600,
  openTime: "8:00 AM",
  closeTime: "5:00 PM",
}

const DEFAULTS: AvailabilityBlock[] = [
  { day: "Monday", start: "8:00 AM", end: "5:00 PM" },
  { day: "Tuesday", start: "8:00 AM", end: "5:00 PM" },
  { day: "Wednesday", start: "8:00 AM", end: "5:00 PM" },
  { day: "Thursday", start: "8:00 AM", end: "5:00 PM" },
  { day: "Friday", start: "8:00 AM", end: "5:00 PM" },
  { day: "Saturday", start: "9:00 AM", end: "4:00 PM" },
]

export const ADMIN_DOCTORS: AdminDoctor[] = [
  {
    id: "ad001",
    name: "Dr. Ana Bautista",
    specialty: "Dermatology",
    title: "Board-certified Dermatologist",
    years: 12,
    email: "a.bautista@abcderma.ph",
    phone: "0917 111 2233",
    active: true,
    schedule: DEFAULTS,
  },
  {
    id: "ad002",
    name: "Dr. Carlo Reyes",
    specialty: "Dermatopathology",
    title: "Dermatopathologist",
    years: 9,
    email: "c.reyes@abcderma.ph",
    phone: "0917 111 2244",
    active: true,
    schedule: DEFAULTS.filter((d) => d.day !== "Monday" && d.day !== "Saturday"),
  },
  {
    id: "ad003",
    name: "Dr. Sofia Lim",
    specialty: "Pathology",
    title: "Pathologist",
    years: 10,
    email: "s.lim@abcderma.ph",
    phone: "0917 111 2255",
    active: true,
    schedule: DEFAULTS.filter((d) => d.day !== "Saturday"),
  },
  {
    id: "ad004",
    name: "Dr. Ramon Cruz",
    specialty: "Radiology",
    title: "Radiologist",
    years: 16,
    email: "r.cruz@abcderma.ph",
    phone: "0917 111 2266",
    active: false,
    schedule: DEFAULTS.filter((d) => d.day === "Monday" || d.day === "Wednesday" || d.day === "Friday"),
  },
]

export const ADMIN_SERVICES: AdminService[] = [
  {
    id: "as001",
    name: "Dermatology Consultation",
    duration: "30 min",
    price: 600,
    doctorIds: ["ad001", "ad002"],
    active: true,
  },
  {
    id: "as002",
    name: "Acne & Acne Scar Treatment",
    duration: "45 min",
    price: 800,
    doctorIds: ["ad001"],
    active: true,
  },
  {
    id: "as003",
    name: "Skin Check / Mole Screening",
    duration: "30 min",
    price: 500,
    doctorIds: ["ad001", "ad003"],
    active: true,
  },
  {
    id: "as004",
    name: "Eczema & Psoriasis Management",
    duration: "45 min",
    price: 750,
    doctorIds: ["ad001"],
    active: true,
  },
  {
    id: "as005",
    name: "Skin Biopsy",
    duration: "60 min",
    price: 1500,
    doctorIds: ["ad002"],
    active: false,
  },
]

export const ADMIN_STAFF: StaffMember[] = [
  {
    id: "st001",
    name: "Marie Lumagui",
    role: "admin",
    email: "marie@abcderma.ph",
    phone: "0917 222 3301",
    active: true,
  },
  {
    id: "st002",
    name: "Jomar Reyes",
    role: "receptionist",
    email: "jomar@abcderma.ph",
    phone: "0917 222 3302",
    active: true,
  },
  {
    id: "st003",
    name: "Althea Villanueva",
    role: "receptionist",
    email: "althea@abcderma.ph",
    phone: "0917 222 3303",
    active: true,
  },
  {
    id: "st004",
    name: "Dr. Ana Bautista",
    role: "doctor",
    email: "a.bautista@abcderma.ph",
    phone: "0917 222 3304",
    active: true,
  },
  {
    id: "st005",
    name: "Dr. Carlo Reyes",
    role: "doctor",
    email: "c.reyes@abcderma.ph",
    phone: "0917 222 3305",
    active: true,
  },
]

export const ADMIN_PATIENTS: PatientRecord[] = [
  {
    id: "p001",
    name: "Carla Torres",
    age: 29,
    gender: "Female",
    contact: "0917 333 1001",
    lastVisit: "Aug 10, 2026",
    appointmentIds: ["a011", "a005"],
  },
  {
    id: "p002",
    name: "Andres Salazar",
    age: 48,
    gender: "Male",
    contact: "0917 333 1002",
    lastVisit: "Aug 13, 2026",
    appointmentIds: ["a012", "a006"],
  },
  {
    id: "p003",
    name: "Jenny Alcantara",
    age: 32,
    gender: "Female",
    contact: "0917 333 1003",
    lastVisit: "Aug 13, 2026",
    appointmentIds: ["a007"],
  },
  {
    id: "p004",
    name: "Leo Bautista",
    age: 6,
    gender: "Male",
    contact: "0917 333 1004",
    lastVisit: "Aug 14, 2026",
    appointmentIds: ["a008"],
  },
  {
    id: "p005",
    name: "Rosa Dimagiba",
    age: 61,
    gender: "Female",
    contact: "0917 333 1005",
    lastVisit: "Aug 17, 2026",
    appointmentIds: ["a009"],
  },
  {
    id: "p006",
    name: "Nico Ramos",
    age: 35,
    gender: "Male",
    contact: "0917 333 1006",
    lastVisit: "Aug 13, 2026",
    appointmentIds: ["a010"],
  },
]

/* ── Analytics ── */

export const WEEKLY_TREND: AnalyticsDatum[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 14 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 26 },
  { label: "Sat", value: 9 },
  { label: "Sun", value: 4 },
]

export const APPT_BY_SERVICE: AnalyticsDatum[] = [
  { label: "Dermatology Consultation", value: 38 },
  { label: "Acne Treatment", value: 24 },
  { label: "Skin Check / Mole", value: 17 },
  { label: "Eczema Management", value: 12 },
  { label: "Skin Biopsy", value: 5 },
]

export const APPT_BY_DOCTOR: AnalyticsDatum[] = [
  { label: "Dr. Ana Bautista", value: 46 },
  { label: "Dr. Carlo Reyes", value: 27 },
  { label: "Dr. Sofia Lim", value: 15 },
  { label: "Dr. Ramon Cruz", value: 8 },
]

export const BOOKING_SOURCES: SourceDatum[] = [
  { label: "AGAPAY", value: 54, color: "#1B6FED" },
  { label: "Phone", value: 21, color: "#10B981" },
  { label: "Walk-in", value: 16, color: "#F59E0B" },
  { label: "Online", value: 9, color: "#8B5CF6" },
]

export const VISIBILITY_TREND: Array<{ label: string; views: number; requests: number; confirmed: number; completed: number }> = [
  { label: "Jul 7", views: 320, requests: 41, confirmed: 28, completed: 22 },
  { label: "Jul 14", views: 380, requests: 52, confirmed: 36, completed: 29 },
  { label: "Jul 21", views: 410, requests: 58, confirmed: 42, completed: 33 },
  { label: "Jul 28", views: 520, requests: 74, confirmed: 51, completed: 40 },
  { label: "Aug 4", views: 610, requests: 88, confirmed: 63, completed: 49 },
  { label: "Aug 11", views: 700, requests: 96, confirmed: 71, completed: 55 },
]

export const AGAPAY_PERFORMANCE = {
  profileViews: 700,
  requests: 96,
  confirmed: 71,
  completed: 55,
  trend: [40, 55, 48, 66, 74, 88, 96],
}
