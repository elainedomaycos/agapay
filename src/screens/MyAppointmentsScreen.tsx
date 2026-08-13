import { useState } from "react"
import type { Screen, AppSettings, Appointment } from "../types"
import {
  useAppointments,
  upcomingAppointments,
  pastAppointments,
  cancelAppointment,
} from "../lib/appointmentStore"
import { MobileHeader, MobileMenu } from "../components/Layout"
import RescheduleModal from "../components/RescheduleModal"
import Reveal from "../components/Reveal"
import { RowSkeleton, useSimulatedLoading } from "../components/Skeleton"
import { showToast } from "../lib/toastStore"
import Icon from "../components/Icon"

interface Props {
  onNavigate: (s: Screen, data?: unknown) => void
  settings: AppSettings
}

const STATUS_STYLES: Record<Appointment["status"], string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function AppointmentRow({
  appointment,
  onView,
  onReschedule,
  onCancel,
}: {
  appointment: Appointment
  onView: () => void
  onReschedule: () => void
  onCancel: () => void
}) {
  const canManage =
    appointment.status === "confirmed" || appointment.status === "pending"
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-agapay-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 bg-agapay-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="calendar" size={22} className="text-agapay-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {appointment.doctorName}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {appointment.clinicName}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {appointment.service}
            </p>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-4 bg-agapay-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
        <div>
          <p className="font-semibold text-agapay-800">
            {appointment.dateLabel} · {appointment.time}
          </p>
          <p className="text-xs text-agapay-600 mt-0.5">
            ₱{appointment.fee.toLocaleString()}
          </p>
        </div>
        <button
          onClick={onView}
          className="text-sm text-agapay-600 font-semibold hover:underline"
        >
          View →
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={onView}
          className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          View
        </button>
        {canManage && (
          <>
            <button
              onClick={onReschedule}
              className="flex-1 py-2.5 border border-agapay-200 text-agapay-700 rounded-xl text-sm font-medium hover:bg-agapay-50 transition-colors"
            >
              Reschedule
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  title,
  subtitle,
  onBook,
}: {
  title: string
  subtitle: string
  onBook: () => void
}) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
      <div className="w-16 h-16 bg-agapay-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon name="calendar-days" size={32} className="text-agapay-600" />
      </div>
      <p className="font-semibold text-gray-800 text-lg mb-1">{title}</p>
      <p className="text-sm text-gray-400 mb-5">{subtitle}</p>
      <button
        onClick={onBook}
        className="px-6 py-3 bg-agapay-600 text-white rounded-xl font-semibold hover:bg-agapay-700 transition-colors"
      >
        Book an Appointment
      </button>
    </div>
  )
}

export default function MyAppointmentsScreen({ onNavigate, settings }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming")
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<Appointment | null>(null)
  const appointments = useAppointments()
  const loading = useSimulatedLoading(250)

  const upcoming = upcomingAppointments(appointments)
  const past = pastAppointments(appointments)
  const list = tab === "upcoming" ? upcoming : past

  const openAppointment = (id: string) => onNavigate("appointment-detail", id)

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
        currentScreen="appointments"
      />

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <button
          onClick={() => onNavigate("chat")}
          className="px-4 py-2.5 bg-agapay-600 text-white rounded-xl text-sm font-semibold hover:bg-agapay-700 transition-colors"
        >
          + New Booking
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900">
              My Appointments
            </h1>
            <button
              onClick={() => onNavigate("chat")}
              className="px-3 py-2 bg-agapay-600 text-white rounded-xl text-sm font-semibold"
            >
              + Book
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-white border border-gray-100 rounded-2xl p-1.5 mb-6">
            <button
              onClick={() => setTab("upcoming")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                tab === "upcoming"
                  ? "bg-agapay-600 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Upcoming
              {upcoming.length > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    tab === "upcoming"
                      ? "bg-white/20"
                      : "bg-agapay-100 text-agapay-700"
                  }`}
                >
                  {upcoming.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("past")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                tab === "past"
                  ? "bg-agapay-600 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Past
              {past.length > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    tab === "past" ? "bg-white/20" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {past.length}
                </span>
              )}
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          ) : list.length === 0 ? (
            tab === "upcoming" ? (
              <EmptyState
                title="No upcoming appointments"
                subtitle="When you book through Aramon, your appointments will show up here."
                onBook={() => onNavigate("chat")}
              />
            ) : (
              <EmptyState
                title="No past appointments yet"
                subtitle="Completed and cancelled appointments will appear here."
                onBook={() => onNavigate("chat")}
              />
            )
          ) : (
            <div className="flex flex-col gap-4">
              {list.map((appointment, i) => (
                <Reveal key={appointment.id} delay={i * 60}>
                  <AppointmentRow
                    appointment={appointment}
                    onView={() => openAppointment(appointment.id)}
                    onReschedule={() => setRescheduling(appointment)}
                    onCancel={() => setConfirmCancel(appointment)}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reschedule modal */}
      {rescheduling && (
        <RescheduleModal
          appointment={rescheduling}
          onClose={() => setRescheduling(null)}
        />
      )}

      {/* Cancel confirm */}
      {confirmCancel && (
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
              {confirmCancel.doctorName} · {confirmCancel.dateLabel}{" "}
              {confirmCancel.time}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmCancel(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={() => {
                  cancelAppointment(confirmCancel.id)
                  setConfirmCancel(null)
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
