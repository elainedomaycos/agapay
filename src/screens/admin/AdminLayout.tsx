import { useState } from "react"
import type { Screen } from "../../types"
import Icon from "../../components/Icon"
import logo from "../../logo.png"

export interface AdminNavItem {
  label: string
  icon: string
  screen: Screen
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", icon: "layout-dashboard", screen: "admin-dashboard" },
  { label: "Appointments", icon: "calendar", screen: "admin-appointments" },
  { label: "Calendar", icon: "calendar-days", screen: "admin-calendar" },
  { label: "Doctors", icon: "stethoscope", screen: "admin-doctors" },
  { label: "Services", icon: "syringe", screen: "admin-services" },
  { label: "Patients", icon: "users", screen: "admin-patients" },
  { label: "Clinic Profile", icon: "hospital", screen: "admin-clinic" },
  { label: "AGAPAY Visibility", icon: "trending-up", screen: "admin-visibility" },
  { label: "Analytics", icon: "bar-chart", screen: "admin-analytics" },
  { label: "Staff", icon: "briefcase", screen: "admin-staff" },
]

function Sidebar({
  current,
  onNavigate,
}: {
  current: Screen
  onNavigate: (s: Screen) => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="AGAPAY" className="w-10 h-10 rounded-xl object-contain" />
          <div>
            <p className="font-bold text-gray-900 leading-tight">AGAPAY Clinic</p>
            <p className="text-xs text-gray-400">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              current === item.screen
                ? "bg-agapay-50 text-agapay-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon name={item.icon} size={18} className="flex-shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100 space-y-1">
        <button
          onClick={() => onNavigate("landing")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Icon name="log-out" size={18} className="flex-shrink-0" />
          Exit Admin
        </button>
        <div className="flex items-center gap-3 px-3 py-2 mt-1">
          <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold">
            ML
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Marie Lumagui</p>
            <p className="text-xs text-gray-400">Clinic Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileDrawer({
  current,
  onNavigate,
  onClose,
}: {
  current: Screen
  onNavigate: (s: Screen) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src={logo} alt="AGAPAY" className="w-8 h-8 rounded-lg object-contain" />
            <p className="font-bold text-gray-900">Clinic Admin</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {ADMIN_NAV.map((item) => (
            <button
              key={item.screen}
              onClick={() => {
                onNavigate(item.screen)
                onClose()
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                current === item.screen
                  ? "bg-agapay-50 text-agapay-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon name={item.icon} size={18} className="flex-shrink-0" />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate("landing")
              onClose()
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Icon name="log-out" size={18} className="flex-shrink-0" />
            Exit Admin
          </button>
        </nav>
      </div>
    </div>
  )
}

export default function AdminLayout({
  current,
  onNavigate,
  children,
}: {
  current: Screen
  onNavigate: (s: Screen, data?: unknown) => void
  children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="h-screen flex bg-gray-50">
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-100 flex-shrink-0">
        <Sidebar current={current} onNavigate={onNavigate} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <img src={logo} alt="AGAPAY" className="w-8 h-8 rounded-lg object-contain" />
              <p className="font-bold text-gray-900">Clinic Admin</p>
            </div>
            <button
              onClick={() => onNavigate("landing")}
              className="text-sm text-gray-500 font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Exit
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto smooth-scroll">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">{children}</div>
        </main>
      </div>

      {menuOpen && (
        <MobileDrawer current={current} onNavigate={onNavigate} onClose={() => setMenuOpen(false)} />
      )}
    </div>
  )
}
