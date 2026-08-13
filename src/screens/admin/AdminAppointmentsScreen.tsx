import { useState } from "react"
import type { Appointment } from "../../types"
import { useAppointments, updateAppointment, cancelAppointment } from "../../lib/appointmentStore"
import { PageHeader, StatusBadge, SourceBadge, EmptyState } from "../../components/admin/ui"
import Reveal from "../../components/Reveal"
import Icon from "../../components/Icon"
import { RowSkeleton, useSimulatedLoading } from "../../components/Skeleton"
import { showToast } from "../../lib/toastStore"

type ViewFilter = "today" | "week" | "month"

function matchesView(a: Appointment, view: ViewFilter): boolean {
  const label = a.dateLabel.toLowerCase()
  if (view === "today") return label.includes("today")
  if (view === "week")
    return (
      label.includes("tomorrow") ||
      /monday|tuesday|wednesday|thursday|friday|saturday|sunday/.test(label)
    )
  return /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/.test(label)
}

export default function AdminAppointmentsScreen() {
  const appointments = useAppointments()
  const loading = useSimulatedLoading(250)
  const [view, setView] = useState<ViewFilter>("today")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all")

  const tabs: Array<{ key: ViewFilter; label: string }> = [
    { key: "today", label: "Today" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
  ]

  const statusChips: Array<{ key: typeof statusFilter; label: string }> = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ]

  const list = appointments
    .filter((a) => matchesView(a, view))
    .filter((a) => statusFilter === "all" || a.status === statusFilter)
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Manage bookings by date and status."
      />

      {/* Date tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              view === t.key
                ? "bg-agapay-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {statusChips.map((c) => (
          <button
            key={c.key}
            onClick={() => setStatusFilter(c.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === c.key
                ? "bg-gray-800 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No appointments here"
          desc="Try a different date range or status filter."
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-50">
            {list.map((a, i) => (
              <Reveal key={a.id} delay={i * 40}>
                <div className="px-5 py-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 bg-agapay-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name="stethoscope" size={20} className="text-agapay-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">
                            {a.patientName ?? "Maria Dela Cruz"}
                          </p>
                          {a.source && <SourceBadge source={a.source} />}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {a.doctorName} · {a.service}
                        </p>
                        <p className="text-xs text-gray-400">
                          {a.clinicName} · ₱{a.fee.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:ml-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{a.time}</p>
                        <p className="text-xs text-gray-400">{a.dateLabel}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>

                    <div className="flex gap-2 md:ml-2">
                      {a.status === "pending" && (
                        <button
                          onClick={() => {
                            updateAppointment(a.id, { status: "confirmed" })
                            showToast("Booking confirmed", "success")
                          }}
                          className="px-3.5 py-2 bg-agapay-600 text-white rounded-xl text-xs font-semibold hover:bg-agapay-700 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {a.status === "confirmed" && (
                        <button
                          onClick={() => {
                            updateAppointment(a.id, { status: "completed" })
                            showToast("Patient checked in", "success")
                          }}
                          className="px-3.5 py-2 bg-green-600 text-white rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors"
                        >
                          Check In
                        </button>
                      )}
                      {(a.status === "pending" || a.status === "confirmed") && (
                        <button
                          onClick={() => {
                            cancelAppointment(a.id)
                            showToast("Appointment cancelled", "info")
                          }}
                          className="px-3.5 py-2 border border-red-100 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {a.status === "completed" && (
                        <span className="text-xs text-gray-400 font-medium self-center">
                          Done
                        </span>
                      )}
                      {a.status === "cancelled" && (
                        <span className="text-xs text-gray-400 font-medium self-center">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
