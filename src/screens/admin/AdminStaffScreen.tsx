import { useState } from "react"
import type { StaffMember, AdminRole } from "../../types"
import {
  useStaff,
  addStaffMember,
  updateStaffMember,
  toggleStaffMember,
} from "../../lib/adminStore"
import { PageHeader, Modal, Toggle, PrimaryButton, GhostButton, RoleBadge } from "../../components/admin/ui"
import Reveal from "../../components/Reveal"
import { showToast } from "../../lib/toastStore"

const ROLES: AdminRole[] = ["admin", "receptionist", "doctor"]

const EMPTY: Omit<StaffMember, "id"> = {
  name: "",
  role: "receptionist",
  email: "",
  phone: "",
  active: true,
}

function StaffFormModal({
  member,
  onSave,
  onClose,
}: {
  member?: StaffMember
  onSave: (data: Omit<StaffMember, "id">) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(
    member
      ? {
          name: member.name,
          role: member.role,
          email: member.email,
          phone: member.phone,
          active: member.active,
        }
      : { ...EMPTY },
  )
  const [error, setError] = useState("")

  const set = (key: keyof typeof form, value: string | boolean | AdminRole) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.")
      return
    }
    onSave({ ...form, name: form.name.trim(), email: form.email.trim() })
  }

  return (
    <Modal title={member ? "Edit Staff Member" : "Add Staff Member"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Full name <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Role</p>
          <div className="flex gap-2">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => set("role", role)}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                  form.role === role
                    ? "bg-agapay-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <div className="flex gap-3 mt-2">
          <PrimaryButton onClick={submit}>{member ? "Save Changes" : "Add Member"}</PrimaryButton>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
        </div>
      </div>
    </Modal>
  )
}

export default function AdminStaffScreen() {
  const staff = useStaff()
  const [modal, setModal] = useState<{ open: boolean; member?: StaffMember }>({ open: false })

  const save = (data: Omit<StaffMember, "id">) => {
    if (modal.member) {
      updateStaffMember(modal.member.id, data)
      showToast("Staff member updated")
    } else {
      addStaffMember({ ...data, id: `st${Date.now()}` })
      showToast("Staff member added")
    }
    setModal({ open: false })
  }

  const counts = {
    admin: staff.filter((s) => s.role === "admin").length,
    receptionist: staff.filter((s) => s.role === "receptionist").length,
    doctor: staff.filter((s) => s.role === "doctor").length,
  }

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle={`${staff.length} members · ${counts.admin} admin · ${counts.receptionist} receptionist · ${counts.doctor} doctor`}
        actions={
          <PrimaryButton onClick={() => setModal({ open: true })}>+ Add Member</PrimaryButton>
        }
      />

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-50">
          {staff.map((m, i) => (
            <Reveal key={m.id} delay={i * 40}>
              <div className={`px-5 py-4 flex items-center gap-4 ${m.active ? "" : "opacity-60"}`}>
                <div className="w-11 h-11 bg-purple-50 rounded-full flex items-center justify-center text-purple-700 font-bold flex-shrink-0">
                  {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{m.name}</p>
                    <RoleBadge role={m.role} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {m.email} · {m.phone}
                  </p>
                </div>
                <Toggle
                  on={m.active}
                  onChange={() => {
                    toggleStaffMember(m.id)
                    showToast(
                      m.active ? "Member deactivated" : "Member activated",
                      "info",
                    )
                  }}
                />
                <button
                  onClick={() => setModal({ open: true, member: m })}
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
        <StaffFormModal
          member={modal.member}
          onSave={save}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}
