import { useState } from "react"
import type { Appointment } from "../types"
import { nextDates, defaultSlots } from "../lib/intentEngine"
import { updateAppointment } from "../lib/appointmentStore"

interface Props {
  appointment: Appointment
  onClose: () => void
}

export default function RescheduleModal({ appointment, onClose }: Props) {
  const dates = nextDates()
  const slots = defaultSlots()
  const [dateKey, setDateKey] = useState(dates[1]?.key ?? "")
  const [slot, setSlot] = useState("")

  const selectedDate = dates.find((d) => d.key === dateKey) ?? dates[1]

  const handleSave = () => {
    if (!selectedDate || !slot) return
    updateAppointment(appointment.id, {
      dateLabel: `${selectedDate.label}, ${selectedDate.sub}`,
      time: slot,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">Reschedule</p>
              <p className="text-sm text-gray-400">
                {appointment.clinicName} · {appointment.doctorName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
              aria-label="Close"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Pick a new date
          </p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {dates.map((date) => (
              <button
                key={date.key}
                onClick={() => setDateKey(date.key)}
                className={`rounded-xl py-3 px-1 text-center border transition-all ${
                  date.key === dateKey
                    ? "bg-agapay-600 border-agapay-600 text-white"
                    : "bg-white border-gray-100 text-gray-700 hover:border-agapay-300"
                }`}
              >
                <p className="text-xs font-semibold">{date.label}</p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    date.key === dateKey ? "text-agapay-100" : "text-gray-400"
                  }`}
                >
                  {date.sub}
                </p>
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Pick a time
          </p>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={`rounded-xl py-3 text-sm font-semibold border transition-all ${
                  slot === s
                    ? "bg-agapay-600 border-agapay-600 text-white"
                    : "bg-white border-gray-100 text-gray-700 hover:border-agapay-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!slot}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
              slot
                ? "bg-agapay-600 text-white hover:bg-agapay-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            Confirm New Time
          </button>
        </div>
      </div>
    </div>
  )
}
