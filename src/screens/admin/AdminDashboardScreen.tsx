import type { Screen } from "../../types"
import { useAppointments } from "../../lib/appointmentStore"
import { usePatients } from "../../lib/adminStore"
import { WEEKLY_TREND, AGAPAY_PERFORMANCE } from "../../data/adminData"
import {
  StatCard,
  PageHeader,
  BarChart,
  StatusBadge,
  SourceBadge,
} from "../../components/admin/ui"
import Reveal from "../../components/Reveal"
import Icon from "../../components/Icon"
import { StatGridSkeleton, useSimulatedLoading } from "../../components/Skeleton"

interface Props {
  onNavigate: (s: Screen) => void
}

export default function AdminDashboardScreen({ onNavigate }: Props) {
  const appointments = useAppointments()
  const patients = usePatients()
  const loading = useSimulatedLoading(250)

  const todayAppointments = appointments.filter(
    (a) => a.status !== "cancelled" && a.dateLabel.toLowerCase().includes("today"),
  ).length

  const pendingBookings = appointments.filter((a) => a.status === "pending").length

  const newAgapayBookings = appointments.filter(
    (a) =>
      a.source === "AGAPAY" &&
      a.status !== "cancelled" &&
      a.dateLabel.toLowerCase().includes("today"),
  ).length

  const recent = appointments
    .filter((a) => a.status === "confirmed" || a.status === "pending")
    .slice(0, 6)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  })()

  const perfItems = [
    { label: "Profile Views", value: AGAPAY_PERFORMANCE.profileViews, max: 800, color: "bg-agapay-500" },
    { label: "Booking Requests", value: AGAPAY_PERFORMANCE.requests, max: 120, color: "bg-agapay-600" },
    { label: "Confirmed", value: AGAPAY_PERFORMANCE.confirmed, max: 100, color: "bg-emerald-500" },
    { label: "Completed", value: AGAPAY_PERFORMANCE.completed, max: 80, color: "bg-purple-500" },
  ]

  return (
    <div>
      <PageHeader
        title={`${greeting}, Marie`}
        subtitle="Here is what is happening at ABC Dermatology Clinic today."
        actions={
          <button
            onClick={() => onNavigate("admin-appointments")}
            className="px-4 py-2.5 bg-agapay-600 text-white rounded-xl text-sm font-semibold hover:bg-agapay-700 transition-colors"
          >
            View Appointments
          </button>
        }
      />

      {/* KPIs */}
      {loading ? (
        <StatGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Reveal delay={0}>
            <StatCard
              label="Today's Appointments"
              value={todayAppointments}
              icon="calendar"
              accent="bg-agapay-50"
              sub="scheduled for today"
            />
          </Reveal>
          <Reveal delay={60}>
            <StatCard
              label="Pending Bookings"
              value={pendingBookings}
              icon="hourglass"
              accent="bg-amber-50"
              sub="awaiting confirmation"
            />
          </Reveal>
          <Reveal delay={120}>
            <StatCard
              label="New AGAPAY Bookings"
              value={newAgapayBookings}
              icon="sparkles"
              accent="bg-blue-50"
              sub="from AGAPAY today"
            />
          </Reveal>
          <Reveal delay={180}>
            <StatCard
              label="Registered Patients"
              value={patients.length}
              icon="users"
              accent="bg-green-50"
              sub="total in your clinic"
            />
          </Reveal>
        </div>
      )}

      {!loading && (
        <div className="grid lg:grid-cols-5 gap-6 mb-6">
          {/* AGAPAY Performance */}
          <Reveal delay={60} className="lg:col-span-3">
            <div className="h-full bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900">AGAPAY Performance</p>
                  <p className="text-xs text-gray-400">This week</p>
                </div>
                <button
                  onClick={() => onNavigate("admin-visibility")}
                  className="text-xs font-semibold text-agapay-600 hover:text-agapay-700"
                >
                  View Visibility →
                </button>
              </div>
              <div className="space-y-4">
                {perfItems.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Weekly trend */}
          <Reveal delay={120} className="lg:col-span-2">
            <div className="h-full bg-white border border-gray-100 rounded-2xl p-5">
              <p className="font-bold text-gray-900 mb-4">Appointments this week</p>
              <BarChart data={WEEKLY_TREND} height={150} />
            </div>
          </Reveal>
        </div>
      )}

      {/* Recent bookings */}
      <Reveal delay={100}>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-900">Upcoming Bookings</p>
            <button
              onClick={() => onNavigate("admin-appointments")}
              className="text-xs font-semibold text-agapay-600 hover:text-agapay-700"
            >
              See all →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recent.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">
                No upcoming bookings.
              </p>
            )}
            {recent.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-9 h-9 bg-agapay-50 rounded-xl flex items-center justify-center text-base">
                  <Icon name="calendar" size={18} className="text-agapay-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {a.patientName ?? "Maria Dela Cruz"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {a.doctorName} · {a.service}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-gray-700">{a.dateLabel}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
                <StatusBadge status={a.status} />
                {a.source && <SourceBadge source={a.source} />}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
