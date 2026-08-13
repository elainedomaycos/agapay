import { useState } from "react"
import type { Screen } from "../types"
import Icon from "../components/Icon"
import logo from "../logo.png"

interface Props {
  onNavigate: (s: Screen) => void
}

export default function RoleSelectScreen({ onNavigate }: Props) {
  const [pending, setPending] = useState<"patient" | "admin" | null>(null)

  const choose = (role: "patient" | "admin") => {
    if (pending) return
    setPending(role)
    setTimeout(() => {
      onNavigate(role === "patient" ? "register" : "admin-login")
    }, 250)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <img
              src={logo}
              alt="AGAPAY"
              className="w-14 h-14 rounded-3xl object-contain mb-4"
            />
            <span className="font-bold text-gray-900 text-xl tracking-wide">AGAPAY</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Who are you?
          </h1>
          <p className="text-gray-400 text-center mb-8 text-lg">
            Choose how you would like to continue
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => choose("patient")}
              disabled={pending !== null}
              className={`flex items-center gap-4 p-5 border-2 rounded-2xl text-left transition-all ${
                pending === "patient"
                  ? "border-agapay-600 bg-agapay-50 scale-[0.99]"
                  : "border-gray-200 hover:border-agapay-400 hover:bg-agapay-50/50"
              }`}
            >
              <div className="w-14 h-14 bg-agapay-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon name="user-round" size={28} className="text-agapay-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">I am a Patient</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Chat with Aramon, find care, and book appointments.
                </p>
              </div>
              <span className="text-agapay-500 text-xl">→</span>
            </button>

            <button
              onClick={() => choose("admin")}
              disabled={pending !== null}
              className={`flex items-center gap-4 p-5 border-2 rounded-2xl text-left transition-all ${
                pending === "admin"
                  ? "border-agapay-600 bg-agapay-50 scale-[0.99]"
                  : "border-gray-200 hover:border-agapay-400 hover:bg-agapay-50/50"
              }`}
            >
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon name="hospital" size={28} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">I am a Clinic Admin</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage appointments, doctors, services, and analytics.
                </p>
              </div>
              <span className="text-purple-500 text-xl">→</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate("landing")}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
