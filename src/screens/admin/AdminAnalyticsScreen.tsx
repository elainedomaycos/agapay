import {
  WEEKLY_TREND,
  APPT_BY_SERVICE,
  APPT_BY_DOCTOR,
  BOOKING_SOURCES,
} from "../../data/adminData"
import { PageHeader, BarChart, HBarChart, DonutChart } from "../../components/admin/ui"

export default function AdminAnalyticsScreen() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Appointments by day, service, doctor, and booking source."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-bold text-gray-900 mb-1">Appointments by Day</p>
          <p className="text-xs text-gray-400 mb-4">This week</p>
          <BarChart data={WEEKLY_TREND} height={160} />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-bold text-gray-900 mb-1">Appointments by Service</p>
          <p className="text-xs text-gray-400 mb-4">Last 30 days</p>
          <HBarChart data={APPT_BY_SERVICE} />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-bold text-gray-900 mb-1">Appointments by Doctor</p>
          <p className="text-xs text-gray-400 mb-4">Last 30 days</p>
          <HBarChart data={APPT_BY_DOCTOR} />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-bold text-gray-900 mb-1">Booking Sources</p>
          <p className="text-xs text-gray-400 mb-4">Where patients come from</p>
          <DonutChart data={BOOKING_SOURCES} />
        </div>
      </div>
    </div>
  )
}
