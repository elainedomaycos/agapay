import { useState, useEffect } from "react"
import { useClinicProfile, updateClinicProfile } from "../../lib/adminStore"
import { useAdminDoctors, useAdminServices } from "../../lib/adminStore"
import { PageHeader, PrimaryButton, GhostButton } from "../../components/admin/ui"
import Reveal from "../../components/Reveal"
import Icon from "../../components/Icon"
import { showToast } from "../../lib/toastStore"

const IMAGE_OPTIONS = ["droplets", "hospital", "baby", "flower", "microscope", "stethoscope"]

export default function AdminClinicScreen() {
  const profile = useClinicProfile()
  const doctors = useAdminDoctors()
  const services = useAdminServices()
  const [form, setForm] = useState({ ...profile })

  useEffect(() => {
    setForm({ ...profile })
  }, [profile])

  const set = (key: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }))

  const save = () => {
    updateClinicProfile({
      ...form,
      consultationFee: Number(form.consultationFee) || 0,
    })
    showToast("Clinic profile saved")
  }

  const activeServices = services.filter((s) => s.active).slice(0, 4)

  return (
    <div>
      <PageHeader
        title="Clinic Profile"
        subtitle="This is how patients see your clinic."
        actions={
          <PrimaryButton onClick={save}>Save Changes</PrimaryButton>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Editor */}
        <Reveal>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-bold text-gray-900 mb-4">Profile Details</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Clinic name</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Specialty</label>
                <input
                  value={form.specialty}
                  onChange={(e) => set("specialty", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Consultation fee (₱)
                </label>
                <input
                  type="number"
                  value={String(form.consultationFee)}
                  onChange={(e) => set("consultationFee", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Opens</label>
                <input
                  value={form.openTime}
                  onChange={(e) => set("openTime", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Closes</label>
                <input
                  value={form.closeTime}
                  onChange={(e) => set("closeTime", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base resize-none"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Clinic image</p>
              <div className="flex gap-2">
                {IMAGE_OPTIONS.map((key) => (
                  <button
                    key={key}
                    onClick={() => set("image", key)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      form.image === key
                        ? "bg-agapay-600 ring-2 ring-agapay-300"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                    aria-label={`Clinic image ${key}`}
                  >
                    <Icon
                      name={key}
                      size={22}
                      className={form.image === key ? "text-white" : "text-gray-600"}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>
        </Reveal>

        {/* Patient view preview */}
        <Reveal delay={80}>
        <div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Patient View Preview
          </p>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-24 bg-gradient-to-br from-agapay-400 to-agapay-700 flex items-center justify-center">
              <Icon name={form.image} size={48} className="text-white/90" />
            </div>
            <div className="p-5">
              <p className="font-bold text-gray-900 text-lg">{form.name}</p>
              <p className="text-xs text-gray-500">{form.specialty}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{form.description}</p>
              <p className="text-xs text-gray-400 mt-2">{form.address}</p>

              <div className="mt-3 bg-agapay-50 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-agapay-700 mb-1">Operating Hours</p>
                <p className="text-xs text-gray-600">
                  Monday – Friday · {form.openTime} – {form.closeTime}
                </p>
                <p className="text-xs text-gray-600">Saturday · 9:00 AM – 4:00 PM</p>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Services
                </p>
                <div className="space-y-1.5">
                  {activeServices.map((s) => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{s.name}</span>
                      <span className="font-semibold text-agapay-600">
                        ₱{s.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Doctors
                </p>
                <div className="space-y-1.5">
                  {doctors.filter((d) => d.active).map((d) => (
                    <div key={d.id} className="flex items-center gap-2 text-sm bg-gray-50 rounded-xl px-3 py-2">
                      <div className="w-7 h-7 bg-agapay-100 rounded-full flex items-center justify-center text-agapay-700 text-xs font-bold flex-shrink-0">
                        {d.name.split(" ").slice(-1)[0][0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.specialty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <GhostButton>Message Clinic</GhostButton>
                <button className="flex-1 py-2.5 bg-agapay-600 text-white rounded-xl text-sm font-semibold hover:bg-agapay-700 transition-colors">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </div>
  )
}
