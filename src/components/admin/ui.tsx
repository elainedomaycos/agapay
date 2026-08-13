import type { AppointmentStatus, BookingSource, AdminRole } from "../../types"
import Icon from "../Icon"

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
}

export const SOURCE_COLORS: Record<BookingSource, string> = {
  AGAPAY: "bg-agapay-100 text-agapay-700",
  Phone: "bg-emerald-100 text-emerald-700",
  "Walk-in": "bg-amber-100 text-amber-700",
  Online: "bg-purple-100 text-purple-700",
}

export const ROLE_STYLES: Record<AdminRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  receptionist: "bg-blue-100 text-blue-700",
  doctor: "bg-green-100 text-green-700",
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}

export function SourceBadge({ source }: { source: BookingSource }) {
  return (
    <span
      className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${SOURCE_COLORS[source]}`}
    >
      {source}
    </span>
  )
}

export function RoleBadge({ role }: { role: AdminRole }) {
  return (
    <span
      className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ROLE_STYLES[role]}`}
    >
      {role}
    </span>
  )
}

export function StatCard({
  label,
  value,
  icon,
  sub,
  accent,
}: {
  label: string
  value: string | number
  icon: string
  sub?: string
  accent?: string
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${accent ?? "bg-agapay-50"}`}
        >
          <Icon name={icon} size={18} className="text-gray-700" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}

export function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        on ? "bg-agapay-600" : "bg-gray-200"
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function BarChart({
  data,
  height = 120,
}: {
  data: Array<{ label: string; value: number }>
  height?: number
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-gray-500">{d.value}</span>
          <div
            className="w-full bg-agapay-500 rounded-t-lg rounded-b-sm transition-all"
            style={{ height: `${Math.round((d.value / max) * (height - 28))}px` }}
          />
          <span className="text-[10px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function HBarChart({
  data,
}: {
  data: Array<{ label: string; value: number }>
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">{d.label}</span>
            <span className="text-sm font-semibold text-gray-800">{d.value}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-agapay-500 rounded-full"
              style={{ width: `${Math.round((d.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DonutChart({
  data,
  size = 160,
}: {
  data: Array<{ label: string; value: number; color: string }>
  size?: number
}) {
  const total = Math.max(
    data.reduce((acc, d) => acc + d.value, 0),
    1,
  )
  let acc = 0
  const segments = data
    .map((d) => {
      const start = (acc / total) * 100
      acc += d.value
      const end = (acc / total) * 100
      return `${d.color} ${start}% ${end}%`
    })
    .join(", ")
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div
        className="rounded-full flex items-center justify-center relative"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${segments})`,
        }}
      >
        <div className="bg-white rounded-full flex flex-col items-center justify-center absolute"
          style={{ width: size * 0.62, height: size * 0.62 }}
        >
          <span className="text-2xl font-extrabold text-gray-900">{total}</span>
          <span className="text-xs text-gray-400">bookings</span>
        </div>
      </div>
      <div className="space-y-2 flex-1 w-full">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-sm text-gray-600 flex-1">{d.label}</span>
            <span className="text-sm font-semibold text-gray-800">{d.value}</span>
            <span className="text-xs text-gray-400 w-10 text-right">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
      <Icon name={icon} size={40} className="text-gray-300 block mb-3" />
      <p className="font-semibold text-gray-800">{title}</p>
      {desc && <p className="text-sm text-gray-400 mt-1">{desc}</p>}
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  type,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      className="px-4 py-2.5 bg-agapay-600 text-white rounded-xl text-sm font-semibold hover:bg-agapay-700 transition-colors"
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        danger
          ? "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  )
}
