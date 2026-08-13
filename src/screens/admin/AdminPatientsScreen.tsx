import { useState } from "react"
import type { PatientRecord } from "../../types"
import { usePatients } from "../../lib/adminStore"
import { getAppointments } from "../../lib/appointmentStore"
import { PageHeader, Modal, StatusBadge, EmptyState } from "../../components/admin/ui"
import Reveal from "../../components/Reveal"

export default function AdminPatientsScreen() {
  const patients = usePatients()
  const [selected, setSelected] = useState<PatientRecord | null>(null)

  const historyOf = (p: PatientRecord) => {
    const all = getAppointments()
    return p.appointmentIds
      .map((id) => all.find((a) => a.id === id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a))
  }

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle={`${patients.length} patients registered with appointment history.`}
      />

      {patients.length === 0 ? (
        <EmptyState icon="users" title="No patients yet" />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-50">
            {patients.map((p, i) => {
              const history = historyOf(p)
              return (
                <Reveal key={p.id} delay={i * 40}>
                  <button
                    onClick={() => setSelected(p)}
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-11 h-11 bg-agapay-50 rounded-full flex items-center justify-center text-agapay-700 font-bold flex-shrink-0">
                      {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">
                        {p.age} · {p.gender} · {p.contact}
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">Last visit</p>
                      <p className="text-xs font-semibold text-gray-600">{p.lastVisit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Appointments</p>
                      <p className="text-xs font-semibold text-gray-600">{history.length}</p>
                    </div>
                    <span className="text-gray-300 text-lg">→</span>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-agapay-100 rounded-full flex items-center justify-center text-agapay-700 font-bold">
              {selected.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {selected.age} years old · {selected.gender}
              </p>
              <p className="text-xs text-gray-400">{selected.contact}</p>
            </div>
          </div>

          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Appointment History
          </p>
          <div className="space-y-3">
            {historyOf(selected).length === 0 && (
              <p className="text-sm text-gray-400">No appointments on record.</p>
            )}
            {historyOf(selected).map((a) => (
              <div key={a.id} className="bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800">{a.service}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{a.doctorName} · {a.clinicName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {a.dateLabel} · {a.time} · ₱{a.fee.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
