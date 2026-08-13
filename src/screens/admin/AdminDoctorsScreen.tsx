import { useState } from "react"
import type { AdminDoctor } from "../../types"
import {
  useAdminDoctors,
  addAdminDoctor,
  updateAdminDoctor,
  toggleAdminDoctor,
} from "../../lib/adminStore"
import { PageHeader, Modal, Toggle, PrimaryButton, GhostButton } from "../../components/admin/ui"
import Reveal from "../../components/Reveal"
import { showToast } from "../../lib/toastStore"

const EMPTY: Omit<AdminDoctor, "id" | "schedule"> = {
  name: "",
  specialty: "",
  title: "",
  years: 0,
  email: "",
  phone: "",
  active: true,
}

function DoctorFormModal({
  doctor,
  onSave,
  onClose,
}: {
  doctor?: AdminDoctor
  onSave: (data: Omit<AdminDoctor, "id" | "schedule">) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(
    doctor
      ? {
          name: doctor.name,
          specialty: doctor.specialty,
          title: doctor.title,
          years: doctor.years,
          email: doctor.email,
          phone: doctor.phone,
          active: doctor.active,
        }
      : { ...EMPTY },
  )
  const [error, setError] = useState("")

  const set = (key: keyof typeof form, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = () => {
    if (!form.name.trim() || !form.specialty.trim()) {
      setError("Doctor name and specialty are required.")
      return
    }
    onSave({
      ...form,
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      title: form.title.trim(),
      years: Number(form.years) || 0,
    })
  }

  return (
    <Modal title={doctor ? "Edit Doctor" : "Add Doctor"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Full name" value={form.name} onChange={(v) => set("name", v)} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Specialty" value={form.specialty} onChange={(v) => set("specialty", v)} required />
          <Field label="Title" value={form.title} onChange={(v) => set("title", v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Years of practice" value={String(form.years)} type="number" onChange={(v) => set("years", v)} />
          <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
        </div>
        <Field label="Email" value={form.email} type="email" onChange={(v) => set("email", v)} />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <div className="flex gap-3 mt-2">
          <PrimaryButton onClick={submit}>{doctor ? "Save Changes" : "Add Doctor"}</PrimaryButton>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
        </div>
      </div>
    </Modal>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
      />
    </div>
  )
}

export default function AdminDoctorsScreen() {
  const doctors = useAdminDoctors()
  const [modal, setModal] = useState<{ open: boolean; doctor?: AdminDoctor }>({ open: false })

  const save = (data: Omit<AdminDoctor, "id" | "schedule">) => {
    if (modal.doctor) {
      updateAdminDoctor(modal.doctor.id, data)
      showToast("Doctor updated")
    } else {
      addAdminDoctor({
        ...data,
        id: `ad${Date.now()}`,
        schedule: [
          { day: "Monday", start: "8:00 AM", end: "5:00 PM" },
          { day: "Tuesday", start: "8:00 AM", end: "5:00 PM" },
          { day: "Wednesday", start: "8:00 AM", end: "5:00 PM" },
          { day: "Thursday", start: "8:00 AM", end: "5:00 PM" },
          { day: "Friday", start: "8:00 AM", end: "5:00 PM" },
          { day: "Saturday", start: "9:00 AM", end: "4:00 PM" },
        ],
      })
      showToast("Doctor added")
    }
    setModal({ open: false })
  }

  return (
    <div>
      <PageHeader
        title="Doctors"
        subtitle={`${doctors.filter((d) => d.active).length} active of ${doctors.length} doctors`}
        actions={
          <PrimaryButton onClick={() => setModal({ open: true })}>+ Add Doctor</PrimaryButton>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map((doc, i) => (
          <Reveal key={doc.id} delay={i * 50}>
            <div
              className={`bg-white border rounded-2xl p-5 ${
                doc.active ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-agapay-100 rounded-full flex items-center justify-center text-agapay-700 font-bold flex-shrink-0">
                  {doc.name.split(" ").slice(-1)[0][0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.specialty}</p>
                </div>
                <Toggle
                  on={doc.active}
                  onChange={() => {
                    toggleAdminDoctor(doc.id)
                    showToast(
                      doc.active ? "Doctor deactivated" : "Doctor activated",
                      "info",
                    )
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">{doc.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {doc.years} yrs experience · {doc.schedule.length} days available
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <span>{doc.phone}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setModal({ open: true, doctor: doc })}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    toggleAdminDoctor(doc.id)
                    showToast(
                      doc.active ? "Doctor deactivated" : "Doctor activated",
                      "info",
                    )
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    doc.active
                      ? "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {doc.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {modal.open && (
        <DoctorFormModal
          doctor={modal.doctor}
          onSave={save}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}
