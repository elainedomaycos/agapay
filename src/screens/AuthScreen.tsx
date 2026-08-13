import { useState, useRef, useEffect } from "react"
import type { Screen } from "../types"
import logo from "../logo.png"

interface Props {
  mode: "login" | "register" | "otp" | "welcome"
  onNavigate: (s: Screen) => void
}

function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
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
            <span className="font-bold text-gray-900 text-xl tracking-wide">
              AGAPAY
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 text-center mb-8 text-lg">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
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
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-agapay-400 focus:ring-2 focus:ring-agapay-100 transition-all text-base"
      />
    </div>
  )
}

/* ── Login ── */
function LoginForm({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNavigate("chat")
  }

  return (
    <AuthLayout title="Welcome back." subtitle="How can we help you today?">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputField
          label="Mobile Number or Email"
          placeholder="0917 000 0000 or email@example.com"
          value={mobile}
          onChange={setMobile}
          required
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={setPassword}
          required
        />

        <button
          type="button"
          className="text-sm text-agapay-600 text-right -mt-2 font-medium hover:underline"
          onClick={() => {}}
        >
          Forgot password?
        </button>

        <button
          type="submit"
          className="w-full py-4 bg-agapay-600 text-white font-semibold rounded-xl hover:bg-agapay-700 transition-colors text-lg mt-1"
        >
          Sign In
        </button>

        <button
          type="button"
          className="w-full py-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-gray-500 text-sm">
          {"Don't have an account? "}
          <button
            type="button"
            onClick={() => onNavigate("register")}
            className="text-agapay-600 font-semibold hover:underline"
          >
            Create an account
          </button>
        </p>
      </form>
    </AuthLayout>
  )
}

/* ── Registration ── */
function RegisterForm({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }))

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) setStep((s) => s + 1)
    else onNavigate("otp")
  }

  const stepLabels = ["About You", "Secure Account", "Verify"]

  return (
    <AuthLayout
      title={
        step === 1
          ? "Let's get to know you."
          : step === 2
            ? "Secure your account."
            : "Verify your number."
      }
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i + 1 <= step
                  ? "bg-agapay-600 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1 < step ? "✓" : i + 1}
            </div>
            {i < 2 && (
              <div
                className={`flex-1 h-1 rounded-full ${
                  i + 1 < step ? "bg-agapay-600" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleNext} className="flex flex-col gap-5">
        {step === 1 && (
          <>
            <InputField
              label="Full Name"
              placeholder="Maria Dela Cruz"
              value={form.fullName}
              onChange={set("fullName")}
              required
            />
            <InputField
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={set("dateOfBirth")}
              required
            />
            <InputField
              label="Mobile Number"
              placeholder="0917 123 4567"
              value={form.mobile}
              onChange={set("mobile")}
              required
            />
            <InputField
              label="Email"
              type="email"
              placeholder="maria@example.com"
              value={form.email}
              onChange={set("email")}
              required
            />
          </>
        )}

        {step === 2 && (
          <>
            <InputField
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={set("password")}
              required
            />
            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              required
            />
            <div className="bg-agapay-50 rounded-xl p-4 text-sm text-agapay-700">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="list-disc list-inside text-agapay-600 gap-1 flex flex-col">
                <li>At least 8 characters</li>
                <li>One number or symbol</li>
              </ul>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="text-center">
            <p className="text-gray-500 mb-6">
              We will send a 6-digit code to{" "}
              <span className="font-semibold text-gray-700">
                {form.mobile || "0917 123 4567"}
              </span>
            </p>
            <button
              type="submit"
              className="w-full py-4 bg-agapay-600 text-white font-semibold rounded-xl hover:bg-agapay-700 transition-colors text-lg"
            >
              Send Verification Code
            </button>
          </div>
        )}

        {step < 3 && (
          <button
            type="submit"
            className="w-full py-4 bg-agapay-600 text-white font-semibold rounded-xl hover:bg-agapay-700 transition-colors text-lg mt-2"
          >
            Continue
          </button>
        )}

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="text-agapay-600 font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  )
}

/* ── OTP ── */
function OTPForm({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(60)
  const [error, setError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const code = otp.join("")
    if (code === "123456") {
      onNavigate("welcome")
    } else {
      setError("Incorrect code. Use 123456 for this prototype.")
    }
  }

  return (
    <AuthLayout
      title="Enter your code."
      subtitle="We sent a 6-digit code to your mobile number."
    >
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all focus:border-agapay-500 focus:ring-2 focus:ring-agapay-100 border-gray-200"
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <p className="text-xs text-gray-400 text-center bg-yellow-50 border border-yellow-200 rounded-xl py-2 px-4">
          Prototype hint: use code <span className="font-bold">123456</span>
        </p>

        <button
          onClick={handleVerify}
          className="w-full py-4 bg-agapay-600 text-white font-semibold rounded-xl hover:bg-agapay-700 transition-colors text-lg"
        >
          Verify
        </button>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-gray-400">
              Resend code in{" "}
              <span className="font-semibold text-gray-600">{countdown}s</span>
            </p>
          ) : (
            <button
              onClick={() => setCountdown(60)}
              className="text-sm text-agapay-600 font-semibold hover:underline"
            >
              Resend code
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

/* ── Welcome ── */
function WelcomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="min-h-screen bg-agapay-600 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg">
        <svg
          className="w-10 h-10 text-agapay-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold text-white mb-3">
        Welcome to AGAPAY, Maria.
      </h1>
      <p className="text-xl text-agapay-200 mb-12">Your account is ready.</p>

      <button
        onClick={() => onNavigate("chat")}
        className="px-10 py-4 bg-white text-agapay-700 font-bold rounded-2xl hover:bg-agapay-50 transition-all text-lg shadow-lg"
      >
        Meet Aramon →
      </button>
    </div>
  )
}

/* ── Auth Screen Router ── */
export default function AuthScreen({ mode, onNavigate }: Props) {
  switch (mode) {
    case "login":
      return <LoginForm onNavigate={onNavigate} />
    case "register":
      return <RegisterForm onNavigate={onNavigate} />
    case "otp":
      return <OTPForm onNavigate={onNavigate} />
    case "welcome":
      return <WelcomeScreen onNavigate={onNavigate} />
    default:
      return <LoginForm onNavigate={onNavigate} />
  }
}
