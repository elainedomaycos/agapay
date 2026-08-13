import { useState } from "react"
import type { Screen, AppSettings } from "../types"
import { MobileHeader, MobileMenu } from "../components/Layout"
import Icon from "../components/Icon"

interface Props {
  onNavigate: (s: Screen) => void
  settings: AppSettings
  onSettingsChange: (s: Partial<AppSettings>) => void
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? "bg-agapay-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-6" : ""
        }`}
      />
    </button>
  )
}

function SettingRow({
  icon,
  label,
  desc,
  right,
}: {
  icon: string
  label: string
  desc?: string
  right: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon name={icon} size={20} className="text-gray-500 flex-shrink-0" />
        <div>
          <p className="font-medium text-gray-800">{label}</p>
          {desc && <p className="text-sm text-gray-400">{desc}</p>}
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">{right}</div>
    </div>
  )
}

export default function SettingsScreen({
  onNavigate,
  settings,
  onSettingsChange,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const categories = [
    {
      title: "Accessibility",
      icon: "accessibility",
      rows: [
        {
          icon: "user-round",
          label: "Senior-Friendly Mode",
          desc: "Larger text, bigger buttons, more spacing",
          right: (
            <Toggle
              checked={settings.seniorMode}
              onChange={(v) => onSettingsChange({ seniorMode: v })}
            />
          ),
        },
        {
          icon: "type",
          label: "Text Size",
          desc:
            settings.textSize === "normal"
              ? "Normal"
              : settings.textSize === "large"
                ? "Large"
                : "Extra Large",
          right: (
            <select
              value={settings.textSize}
              onChange={(e) =>
                onSettingsChange({
                  textSize: e.target.value as AppSettings["textSize"],
                })
              }
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-agapay-400"
            >
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="xlarge">Extra Large</option>
            </select>
          ),
        },
        {
          icon: "palette",
          label: "High Contrast",
          desc: "Improve readability",
          right: (
            <Toggle
              checked={settings.highContrast}
              onChange={(v) => onSettingsChange({ highContrast: v })}
            />
          ),
        },
        {
          icon: "mic",
          label: "Voice Assistance",
          desc: "Enable voice input by default",
          right: (
            <Toggle
              checked={settings.voiceAssistance}
              onChange={(v) => onSettingsChange({ voiceAssistance: v })}
            />
          ),
        },
      ],
    },
    {
      title: "Language",
      icon: "globe",
      rows: [
        {
          icon: "languages",
          label: "App Language",
          desc: `Current: ${settings.language}`,
          right: (
            <select
              value={settings.language}
              onChange={(e) =>
                onSettingsChange({
                  language: e.target.value as AppSettings["language"],
                })
              }
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-agapay-400"
            >
              <option value="English">English</option>
              <option value="Filipino">Filipino</option>
              <option value="Bicolano">Bicolano</option>
            </select>
          ),
        },
      ],
    },
    {
      title: "Notifications",
      icon: "bell",
      rows: [
        {
          icon: "bell",
          label: "Push Notifications",
          desc: "Appointment reminders and updates",
          right: (
            <Toggle
              checked={settings.notifications}
              onChange={(v) => onSettingsChange({ notifications: v })}
            />
          ),
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: "lock",
      rows: [
        {
          icon: "lock",
          label: "Change Password",
          desc: undefined,
          right: (
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
          ),
        },
        {
          icon: "shield",
          label: "Privacy Settings",
          desc: undefined,
          right: (
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
          ),
        },
        {
          icon: "smartphone",
          label: "Biometric Login",
          desc: undefined,
          right: <Toggle checked={false} onChange={() => {}} />,
        },
      ],
    },
    {
      title: "About AGAPAY",
      icon: "info",
      rows: [
        {
          icon: "info",
          label: "About AGAPAY",
          desc: undefined,
          right: (
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
          ),
        },
        {
          icon: "file",
          label: "Terms of Service",
          desc: undefined,
          right: (
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
          ),
        },
        {
          icon: "shield-check",
          label: "Privacy Policy",
          desc: undefined,
          right: (
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
          ),
        },
      ],
    },
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
        currentScreen="settings"
      />

      <div className="hidden lg:flex items-center px-6 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 lg:hidden">
            Settings
          </h1>

          {/* Senior mode highlight */}
          {settings.seniorMode && (
            <div className="bg-agapay-50 border border-agapay-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <Icon name="user-round" size={28} className="text-agapay-700" />
              <div>
                <p className="font-semibold text-agapay-800">
                  Senior-Friendly Mode is on
                </p>
                <p className="text-sm text-agapay-600">
                  Larger text and buttons are active.
                </p>
              </div>
            </div>
          )}

          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden"
            >
              <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                <Icon name={cat.icon} size={16} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {cat.title}
                </p>
              </div>
              <div className="px-5">
                {cat.rows.map((row) => (
                  <SettingRow
                    key={row.label}
                    icon={row.icon}
                    label={row.label}
                    desc={row.desc}
                    right={row.right}
                  />
                ))}
              </div>
            </div>
          ))}

          <p className="text-center text-xs text-gray-300 mt-4 pb-4">
            AGAPAY Phase 1 Prototype · Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
