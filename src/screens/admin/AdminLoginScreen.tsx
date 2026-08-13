import { useState } from "react"
import type { Screen } from "../../types"
import Icon from "../../components/Icon"

interface Props {
  onNavigate: (s: Screen) => void
}

export default function AdminLoginScreen({ onNavigate }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.")
      return
    }
    setError("")
    onNavigate("admin-dashboard")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-purple-600 rounded-3xl flex items-center justify-center mb-4">
              <Icon name="hospital" size={28} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-xl tracking-wide">
              AGAPAY Clinic Admin
            </span>
            <span className="text-sm text-gray-400 mt-1">
              ABC Dermatology Clinic · Batangas City
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Sign in to the console
          </h1>
          <p className="text-gray-400 text-center mb-8 text-lg">
            Manage your clinic from one dashboard.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Work email <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="email"
                placeholder="admin@abcderma.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition-colors text-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-center">
            <p className="text-sm text-gray-500">
              Demo access — use any email and password.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Tip: <span className="font-mono">admin@abcderma.ph</span>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={() => onNavigate("login")}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Patient login
            </button>
            <span className="text-gray-200">•</span>
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
