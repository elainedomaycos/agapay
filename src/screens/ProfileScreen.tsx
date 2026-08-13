import { useState } from "react"
import type { Screen, AppSettings } from "../types"
import { MOCK_USER } from "../data/mockData"
import { MobileHeader, MobileMenu } from "../components/Layout"
import Icon from "../components/Icon"

interface Props {
  onNavigate: (s: Screen) => void
  settings: AppSettings
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <p className="text-sm text-gray-400 font-medium">{label}</p>
      <p className="text-base text-gray-800 font-medium">{value}</p>
    </div>
  )
}

export default function ProfileScreen({ onNavigate, settings }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const actions = [
    { label: "Edit Profile", icon: "pencil" },
    { label: "Security", icon: "lock" },
    { label: "Privacy", icon: "shield" },
    { label: "Language", icon: "globe" },
    { label: "Notifications", icon: "bell" },
  ]

  return (
    <div
      className={`flex flex-col h-full bg-surface ${
        settings.seniorMode ? "senior-mode" : ""
      }`}
    >
      <div className="lg:hidden">
        <MobileHeader
          onNavigate={onNavigate}
          onMenuOpen={() => setMenuOpen(true)}
        />
      </div>
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        currentScreen="profile"
      />

      <div className="hidden lg:flex items-center px-6 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 lg:hidden">
            My Profile
          </h1>

          {/* Avatar + name */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-4 flex items-center gap-5">
            <div className="w-20 h-20 bg-agapay-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-agapay-700">
                {MOCK_USER.avatarInitials}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {MOCK_USER.name}
              </p>
              <p className="text-sm text-gray-400 mt-0.5 font-mono">
                {MOCK_USER.agapayId}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-xs text-green-600 font-medium">
                  Verified Patient
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
            <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Account Information
            </p>
            <InfoRow label="Mobile" value={MOCK_USER.mobile} />
            <InfoRow label="Email" value={MOCK_USER.email} />
            <InfoRow label="Date of Birth" value={MOCK_USER.dateOfBirth} />
            <InfoRow label="AGAPAY ID" value={MOCK_USER.agapayId} />
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
            {actions.map((action, i) => (
              <button
                key={action.label}
                className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                  i > 0 ? "border-t border-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name={action.icon} size={20} className="text-gray-500" />
                  <p className="font-medium text-gray-700">{action.label}</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* Log out */}
          <button
            onClick={() => onNavigate("landing")}
            className="w-full py-4 border border-red-100 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
