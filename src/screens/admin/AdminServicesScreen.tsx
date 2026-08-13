import { useState } from "react"
import type { AdminService } from "../../types"
import {
  useAdminServices,
  useAdminDoctors,
  addAdminService,
  updateAdminService,
  toggleAdminService,
} from "../../lib/adminStore"
import { PageHeader, Modal, Toggle, PrimaryButton, GhostButton } from "../../components/admin/ui"
import Reveal from "../../components/Reveal"
import Icon from "../../components/Icon"
import { showToast } from "../../lib/toastStore"

const EMPTY: Omit<AdminService, "id"> = {
  name: "",
  duration: "30 min",
  price: 0,
  doctorIds: [],
  active: true,
}

function ServiceFormModal({
  service,
  onSave,
  onClose,
}: {
  service?: AdminService
  onSave: (data: Omit<AdminService, "id">) => void
  onClose: () => void
}) {
  const doctors = useAdminDoctors()
  const activeDoctors = doctors.filter((d) => d.active)
  const [form, setForm] = useState(
    service
      ? {
          name: service.name,
          duration: service.duration,
          price: service.price,
          doctorIds: [...service.doctorIds],
          active: service.active,
        }
      : { ...EMPTY, doctorIds: [] as string[] },
  )
  const [error, setError] = useState("")

  const set = (key: keyof typeof form, value: string | number | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleDoctor = (id: string) =>
    setForm((f) => ({
      ...f,
      doctorIds: f.doctorIds.includes(id)
        ? f.doctorIds.filter((d) => d !== id)
        : [...f.doctorIds, id],
    }))

  const submit = () => {
    if (!form.name.trim() || form.price <= 0) {
      setError("Service name and a valid price are required.")
      return
    }
    onSave({
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
    })
  }

  return (
    <Modal title={service ? "Edit Service" : "Add Service"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Service name" value={form.name} onChange={(v) => set("name", v)} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Duration" value={form.duration} onChange={(v) => set("duration", v)} />
          <Field label="Price (₱)" value={String(form.price)} type="number" onChange={(v) => set("price", v)} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Assigned doctors</p>
          <div className="space-y-2">
            {activeDoctors.length === 0 && (
              <p className="text-sm text-gray-400">No active doctors to assign.</p>
            )}
            {activeDoctors.map((doc) => (
              <label key={doc.id} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.doctorIds.includes(doc.id)}
                  onChange={() => toggleDoctor(doc.id)}
                  className="w-4 h-4 accent-agapay-600"
                />
                <span className="text-sm text-gray-700 font-medium">{doc.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{doc.specialty}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <div className="flex gap-3 mt-2">
          <PrimaryButton onClick={submit}>{service ? "Save Changes" : "Add Service"}</PrimaryButton>
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

export default function AdminServicesScreen() {
  const services = useAdminServices()
  const doctors = useAdminDoctors()
  const [modal, setModal] = useState<{ open: boolean; service?: AdminService }>({ open: false })

  const save = (data: Omit<AdminService, "id">) => {
    if (modal.service) {
      updateAdminService(modal.service.id, data)
      showToast("Service updated")
    } else {
      addAdminService({ ...data, id: `as${Date.now()}` })
      showToast("Service added")
    }
    setModal({ open: false })
  }

  const doctorName = (id: string) => doctors.find((d) => d.id === id)?.name ?? "Unassigned"

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Consultation types, pricing, and assigned doctors."
        actions={
          <PrimaryButton onClick={() => setModal({ open: true })}>+ Add Service</PrimaryButton>
        }
      />

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-50">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 40}>
              <div className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-agapay-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="syringe" size={20} className="text-agapay-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-gray-900 ${s.active ? "" : "line-through text-gray-400"}`}>
                      {s.name}
                    </p>
                    <Toggle
                      on={s.active}
                      onChange={() => {
                        toggleAdminService(s.id)
                        showToast(
                          s.active ? "Service deactivated" : "Service activated",
                          "info",
                        )
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {s.duration} · {s.doctorIds.map(doctorName).join(", ") || "No doctors assigned"}
                  </p>
                </div>
                <p className="font-bold text-agapay-600 text-lg flex-shrink-0">
                  ₱{s.price.toLocaleString()}
                </p>
                <button
                  onClick={() => setModal({ open: true, service: s })}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  Edit
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {modal.open && (
        <ServiceFormModal
          service={modal.service}
          onSave={save}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}
