import { useState } from "react"
import { VISIBILITY_TREND, AGAPAY_PERFORMANCE, BOOKING_SOURCES } from "../../data/adminData"
import { PageHeader, StatCard, DonutChart } from "../../components/admin/ui"

export default function AdminVisibilityScreen() {
  const [metric, setMetric] = useState<"views" | "requests" | "confirmed" | "completed">("requests")

  const colors: Record<typeof metric, string> = {
    views: "#93C5FD",
    requests: "#1B6FED",
    confirmed: "#10B981",
    completed: "#8B5CF6",
  }

  const totals = VISIBILITY_TREND[VISIBILITY_TREND.length - 1]
  const maxValue = Math.max(
    ...VISIBILITY_TREND.map((d) => d.views),
    1,
  )

  const conversion = [
    { step: "Profile Views", value: AGAPAY_PERFORMANCE.profileViews, pct: 100 },
    {
      step: "Booking Requests",
      value: AGAPAY_PERFORMANCE.requests,
      pct: Math.round((AGAPAY_PERFORMANCE.requests / AGAPAY_PERFORMANCE.profileViews) * 100),
    },
    {
      step: "Confirmed",
      value: AGAPAY_PERFORMANCE.confirmed,
      pct: Math.round((AGAPAY_PERFORMANCE.confirmed / AGAPAY_PERFORMANCE.requests) * 100),
    },
    {
      step: "Completed",
      value: AGAPAY_PERFORMANCE.completed,
      pct: Math.round((AGAPAY_PERFORMANCE.completed / AGAPAY_PERFORMANCE.confirmed) * 100),
    },
  ]

  const metricTabs: Array<{ key: typeof metric; label: string }> = [
    { key: "views", label: "Profile Views" },
    { key: "requests", label: "Requests" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
  ]

  return (
    <div>
      <PageHeader
        title="AGAPAY Visibility"
        subtitle="See exactly how many patients found and booked your clinic through AGAPAY."
      />

      {/* Attribution stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Profile Views" value={totals.views.toLocaleString()} icon="eye" accent="bg-blue-50" sub="patients saw your profile" />
        <StatCard label="Booking Requests" value={totals.requests} icon="mail" accent="bg-agapay-50" sub="through AGAPAY" />
        <StatCard label="Confirmed" value={totals.confirmed} icon="check-circle" accent="bg-green-50" sub="from AGAPAY requests" />
        <StatCard label="Completed" value={totals.completed} icon="party-popper" accent="bg-purple-50" sub="visits completed" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Trend chart */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <p className="font-bold text-gray-900">Booking Attribution Trend</p>
              <p className="text-xs text-gray-400">Weekly, last 6 weeks</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {metricTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setMetric(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    metric === t.key
                      ? "bg-gray-800 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-3" style={{ height: 180 }}>
            {VISIBILITY_TREND.map((d) => {
              const value =
                metric === "views" ? d.views : metric === "requests" ? d.requests : metric === "confirmed" ? d.confirmed : d.completed
              const height = Math.round((value / maxValue) * 150)
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-600">{value}</span>
                  <div className="w-full flex items-end justify-center gap-1" style={{ height: 150 }}>
                    <div
                      className="w-5 rounded-t-lg transition-all"
                      style={{
                        height: `${height}px`,
                        background: colors[metric],
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{d.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-bold text-gray-900 mb-4">Conversion Funnel</p>
          <div className="space-y-3">
            {conversion.map((c, i) => (
              <div key={c.step}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{c.step}</span>
                  <span className="text-sm font-bold text-gray-900">{c.value}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(c.pct, 100)}%`,
                      background: ["#93C5FD", "#1B6FED", "#10B981", "#8B5CF6"][i],
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{c.pct}% of previous step</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source breakdown */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-6">
        <p className="font-bold text-gray-900 mb-4">Booking Source Breakdown</p>
        <DonutChart data={BOOKING_SOURCES} />
      </div>
    </div>
  )
}
