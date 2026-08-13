import { useState } from "react"
import type { Screen, AppSettings, Appointment } from "../types"
import {
  useAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointment,
} from "../lib/appointmentStore"
import { MobileHeader, MobileMenu } from "../components/Layout"
import RescheduleModal from "../components/RescheduleModal"
import Reveal from "../components/Reveal"
import { showToast } from "../lib/toastStore"
import Icon from "../components/Icon"

interface Props {
  onNavigate: (s: Screen, data?: unknown) => void
  settings: AppSettings
  appointmentId?: string
}

const STATUS_STYLES: Record<Appointment["status"], string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
}

export default function AppointmentDetailScreen({
  onNavigate,
  settings,
  appointmentId,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showReschedule, setShowReschedule] = useState(false)
  const [showCancel, setShowCancel] = useState(false)

  const appointments = useAppointments()
  const appointment = appointmentId
    ? getAppointmentById(appointmentId)
    : appointments.find(
        (a) => a.status === "confirmed" || a.status === "pending",
      )

  const canManage =
    appointment &&
    (appointment.status === "confirmed" || appointment.status === "pending")

  if (!appointment) {
    return (
      <div
        className={`flex flex-col h-full bg-surface ${
          settings.seniorMode ? "senior-mode" : ""
        }`}
      >
        <div className="lg:hidden">
          <MobileHeader
            onNavigate={onNavigate}
            onMenuOpen={() => setMenuOpen(true)}
          />
        </div>
        <MobileMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={onNavigate}
          currentScreen="appointment-detail"
        />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="inbox" size={32} className="text-gray-400" />
          </div>
          <p className="font-semibold text-gray-800 text-lg mb-1">
            Appointment not found
          </p>
          <p className="text-sm text-gray-400 mb-6">
            This appointment may no longer exist.
          </p>
          <button
            onClick={() => onNavigate("appointments")}
            className="px-6 py-3 bg-agapay-600 text-white rounded-xl font-semibold hover:bg-agapay-700 transition-colors"
          >
            Back to My Appointments
          </button>
        </div>
      </div>
    )
  }

  const details: Array<{ label: string; value: string }> = [
    { label: "Clinic", value: appointment.clinicName },
    { label: "Address", value: appointment.clinicAddress ?? "" },
    { label: "Doctor", value: appointment.doctorName },
    { label: "Service", value: appointment.service },
    { label: "Date", value: appointment.dateLabel },
    { label: "Time", value: appointment.time },
    { label: "Fee", value: `₱${appointment.fee.toLocaleString()}` },
  ]

  return (
    <div
      className={`flex flex-col h-full bg-surface ${
        settings.seniorMode ? "senior-mode" : ""
      }`}
    >
      <div className="lg:hidden">
        <MobileHeader
          onNavigate={onNavigate}
          onMenuOpen={() => setMenuOpen(true)}
        />
      </div>
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        currentScreen="appointment-detail"
      />

      {/* Desktop header */}
      <div className="hidden lg:flex items-center gap-4 px-6 py-5 bg-white border-b border-gray-100">
        <button
          onClick={() => onNavigate("appointments")}
          className="w-9 h-9 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-500"
          aria-label="Back"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appointment Details
          </h1>
          <p className="text-sm text-gray-400">{appointment.clinicName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment</h1>
              <p className="text-sm text-gray-400">{appointment.clinicName}</p>
            </div>
            <button
              onClick={() => onNavigate("appointments")}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
            >
              ← Back
            </button>
          </div>

          {/* Status banner */}
          <Reveal>
            <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-4 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-agapay-600 to-agapay-400" />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900 text-xl">
                    {appointment.doctorName}
                  </p>
                  <p className="text-sm text-gray-500">{appointment.service}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-medium ${STATUS_STYLES[appointment.status]}`}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
              </div>
              <div className="bg-agapay-50 rounded-2xl px-5 py-4">
                <p className="text-lg font-bold text-agapay-800">
                  {appointment.dateLabel}
                </p>
                <p className="font-semibold text-agapay-600">
                  {appointment.time}
                </p>
                <p className="text-sm text-agapay-600 mt-1">
                  ₱{appointment.fee.toLocaleString()}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={80}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Appointment Details
              </p>
              <div className="flex flex-col divide-y divide-gray-50">
                {details.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <p className="text-sm text-gray-400 font-medium flex-shrink-0">
                      {row.label}
                    </p>
                    <p className="text-sm text-gray-800 font-medium text-right">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Actions */}
          {canManage && (
            <Reveal delay={140}>
              <button
                onClick={() => {
                  updateAppointment(appointment.id, {
                    reminder: !appointment.reminder,
                  })
                  showToast(
                    appointment.reminder
                      ? "Reminder removed"
                      : "Reminder set. I will notify you before your appointment.",
                    "success",
                  )
                }}
                className={`w-full py-4 rounded-2xl font-semibold mb-3 transition-colors flex items-center justify-center gap-2 ${
                  appointment.reminder
                    ? "bg-agapay-50 text-agapay-700 hover:bg-agapay-100"
                    : "bg-agapay-600 text-white hover:bg-agapay-700"
                }`}
              >
                <Icon name="bell" size={18} />
                {appointment.reminder ? "Reminder On" : "Add Reminder"}
              </button>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setShowReschedule(true)}
                  className="flex-1 py-4 border border-agapay-200 text-agapay-700 rounded-2xl font-semibold hover:bg-agapay-50 transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => setShowCancel(true)}
                  className="flex-1 py-4 border border-red-100 text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition-colors"
                >
                  Cancel Appointment
                </button>
              </div>
            </Reveal>
          )}

          {appointment.status === "cancelled" && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center mb-6">
              <p className="font-semibold text-red-600 mb-1">
                This appointment was cancelled
              </p>
              <p className="text-sm text-red-400">
                Book a new one whenever you are ready.
              </p>
              <button
                onClick={() => onNavigate("chat")}
                className="mt-4 px-5 py-2.5 bg-agapay-600 text-white rounded-xl font-semibold hover:bg-agapay-700 transition-colors"
              >
                Book New Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule modal */}
      {showReschedule && (
        <RescheduleModal
          appointment={appointment}
          onClose={() => setShowReschedule(false)}
        />
      )}

      {/* Cancel confirm */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">
              Cancel this appointment?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {appointment.doctorName} · {appointment.dateLabel}{" "}
              {appointment.time}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancel(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={() => {
                  cancelAppointment(appointment.id)
                  setShowCancel(false)
                  showToast("Appointment cancelled", "info")
                }}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
