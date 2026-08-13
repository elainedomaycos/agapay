import { useState } from "react"
import { useAdminDoctors } from "../../lib/adminStore"
import { PageHeader, EmptyState } from "../../components/admin/ui"
import { Skeleton, useSimulatedLoading } from "../../components/Skeleton"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function AdminCalendarScreen() {
  const doctors = useAdminDoctors()
  const loading = useSimulatedLoading(250)
  const [showInactive, setShowInactive] = useState(false)

  const list = showInactive ? doctors : doctors.filter((d) => d.active)

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Doctor schedules and availability blocks."
        actions={
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 accent-agapay-600"
            />
            Show inactive doctors
          </label>
        }
      />

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon="calendar-days"
          title="No doctors available"
          desc="Add doctors first so their schedules appear on the calendar."
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3.5 text-gray-500 font-semibold w-52">Doctor</th>
                {DAYS.map((d) => (
                  <th key={d} className="px-3 py-3.5 text-gray-500 font-semibold">
                    {d.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((doc) => (
                <tr key={doc.id} className={doc.active ? "" : "opacity-50"}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-400">{doc.specialty}</p>
                  </td>
                  {DAYS.map((day) => {
                    const block = doc.schedule.find((s) => s.day === day)
                    return (
                      <td key={day} className="px-3 py-4 align-top">
                        {block ? (
                          <span className="inline-block bg-agapay-50 border border-agapay-100 text-agapay-700 text-xs font-medium rounded-lg px-2.5 py-1.5">
                            {block.start} – {block.end}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Availability blocks are set per doctor. Edit them from the Doctors page.
      </p>
    </div>
  )
}
