import type { Screen } from "../types"
import Icon from "../components/Icon"
import logo from "../logo.png"

interface Props {
  onNavigate: (s: Screen) => void
}

function AppIcon() {
  return (
    <img
      src={logo}
      alt="AGAPAY"
      className="w-12 h-12 rounded-2xl object-contain"
    />
  )
}

function HeroPreview() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-4 max-w-xs w-full mx-auto border border-gray-100">
      {/* Phone header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="AGAPAY"
            className="w-6 h-6 rounded-md object-contain"
          />
          <span className="text-xs font-semibold text-gray-700">Aramon</span>
        </div>
        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-500">M</span>
        </div>
      </div>

      {/* Aramon message */}
      <div className="flex items-start gap-2 mb-3">
        <div className="w-7 h-7 bg-agapay-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            className="w-3.5 h-3.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2M12 3v4"
            />
          </svg>
        </div>
        <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 flex-1">
          <p className="text-xs text-gray-700 leading-relaxed">
            Hello, Maria! I am Aramon. How can I help you today?
          </p>
        </div>
      </div>

      {/* User message */}
      <div className="flex justify-end mb-3">
        <div className="bg-agapay-600 text-white rounded-xl rounded-br-sm px-3 py-2 max-w-[70%]">
          <p className="text-xs leading-relaxed">Gusto kong magpa-check-up.</p>
        </div>
      </div>

      {/* Aramon response */}
      <div className="flex items-start gap-2 mb-3">
        <div className="w-7 h-7 bg-agapay-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            className="w-3.5 h-3.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2M12 3v4"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 mb-2">
            <p className="text-xs text-gray-700 leading-relaxed">
              Sige po! Tutulungan ko kayong maghanap ng available na clinic.
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["General Check-up", "Specialist", "Dental"].map((opt) => (
              <span
                key={opt}
                className="text-xs bg-agapay-50 text-agapay-700 px-2.5 py-1 rounded-full border border-agapay-100 font-medium"
              >
                {opt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Clinic card mini */}
      <div className="bg-agapay-50 rounded-xl p-3 border border-agapay-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-800">
              ABC Medical Clinic
            </p>
            <p className="text-xs text-gray-500">0.8 km · Open now</p>
          </div>
          <button className="text-xs bg-agapay-600 text-white px-2.5 py-1.5 rounded-lg font-medium">
            Book
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LandingScreen({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AppIcon />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#patients"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              For Patients
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("login")}
              className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate("role-select")}
              className="text-sm bg-agapay-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-agapay-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-agapay-50 text-agapay-700 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-agapay-100">
              <Icon name="flag" size={16} />
              <span>Healthcare, connected around you.</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Find and book healthcare in Batangas by simply talking to{" "}
              <span className="text-agapay-600">Aramon</span>.
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Find care, get help, and navigate your healthcare journey through
              one simple conversation. No menus. No forms. Just talk.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate("role-select")}
                className="px-8 py-4 bg-agapay-600 text-white font-semibold rounded-2xl hover:bg-agapay-700 transition-all hover:shadow-lg text-lg"
              >
                Get Started
              </button>
              <a
                href="#how"
                className="px-8 py-4 border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors text-lg text-center"
              >
                See How It Works
              </a>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              Designed for everyone · Available in English and Filipino
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-agapay-100 rounded-full blur-3xl opacity-30 scale-110" />
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-agapay-600 uppercase tracking-wider mb-3">
              Simple as Talking
            </p>
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "message-circle",
                title: "Tell AGAPAY what you need.",
                desc: "Simply type or speak to Aramon — in English or Filipino. No complicated forms.",
              },
              {
                step: "02",
                icon: "compass",
                title: "Get guided.",
                desc: "Aramon helps you understand your options and next steps. Ask anything.",
              },
              {
                step: "03",
                icon: "calendar",
                title: "Take action.",
                desc: "Book, check, find, and manage your healthcare services — all in one place.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-xs font-bold text-agapay-300 tracking-widest mb-4">
                  {item.step}
                </div>
                <Icon
                  name={item.icon}
                  size={40}
                  className="text-agapay-600 block mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Patients */}
      <section id="patients" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-agapay-600 uppercase tracking-wider mb-3">
                For Patients
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Healthcare that understands you.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                AGAPAY is built for every Filipino patient — from seniors to
                busy parents, from tech-savvy youth to first-time app users. No
                learning curve. No confusion.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: "languages", label: "Speaks Filipino and English" },
                  { icon: "user-round", label: "Designed for seniors and all ages" },
                  { icon: "accessibility", label: "Accessible and high-contrast" },
                  { icon: "lock", label: "Secure and private" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon
                      name={item.icon}
                      size={24}
                      className="text-agapay-600"
                    />
                    <p className="font-medium text-gray-700">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "stethoscope",
                  label: "Find Care",
                  desc: "Find clinics and doctors nearby",
                },
                {
                  icon: "calendar",
                  label: "Book Appointments",
                  desc: "Schedule in seconds",
                },
                {
                  icon: "clipboard",
                  label: "Health Records",
                  desc: "Access your history anytime",
                },
                {
                  icon: "id-card",
                  label: "AGAPAY QR",
                  desc: "Your health ID, always ready",
                },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
                >
                  <Icon
                    name={feature.icon}
                    size={32}
                    className="text-agapay-600 block mb-3"
                  />
                  <p className="font-semibold text-gray-800 mb-1">
                    {feature.label}
                  </p>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-agapay-600 uppercase tracking-wider mb-3">
              For Clinics
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Plans that grow with you
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Choose the subscription that fits your clinic. Upgrade anytime as
              your practice grows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Basic
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  &#8369;1,499
                </span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Conversational patient booking",
                  "Clinic appointment dashboard",
                  "Automated booking confirmations & reminders",
                  "Basic patient information capture",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Icon
                      name="check"
                      size={18}
                      className="text-agapay-500 mt-0.5 shrink-0"
                    />
                    <span className="text-gray-600 text-sm leading-snug">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate("role-select")}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Growth */}
            <div className="bg-white rounded-3xl p-8 border-2 border-agapay-500 shadow-lg shadow-agapay-100/50 relative flex flex-col">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-agapay-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                Most Popular
              </div>
              <p className="text-sm font-semibold text-agapay-600 uppercase tracking-wider mb-2">
                Growth
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  &#8369;2,999
                </span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Basic",
                  "Queue & wait-time management",
                  "Patient follow-up features",
                  "Analytics dashboard",
                  "Enhanced acquisition via AGAPAY discovery",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Icon
                      name="check"
                      size={18}
                      className="text-agapay-500 mt-0.5 shrink-0"
                    />
                    <span className="text-gray-600 text-sm leading-snug">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate("role-select")}
                className="w-full py-3 rounded-xl bg-agapay-600 text-white font-semibold hover:bg-agapay-700 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Clinic Growth + Promotion */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Clinic Growth + Promo
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  &#8369;4,999
                </span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Growth",
                  "Priority visibility & recommendation",
                  "Promotional placement on AGAPAY",
                  "Basic clinic website / landing page",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Icon
                      name="check"
                      size={18}
                      className="text-agapay-500 mt-0.5 shrink-0"
                    />
                    <span className="text-gray-600 text-sm leading-snug">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate("role-select")}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Newspaper style */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left — headline block */}
              <div className="p-10 lg:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-agapay-500" />
                  <span className="text-xs font-bold text-agapay-600 uppercase tracking-widest">
                    Now Available in Batangas
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-5 tracking-tight">
                  Start your
                  <br />
                  healthcare journey.
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
                  Meet Aramon — your personal healthcare concierge. Book
                  appointments, find clinics, and manage your health through
                  one simple conversation.
                </p>
                <div>
                  <button
                    onClick={() => onNavigate("role-select")}
                    className="px-8 py-4 bg-agapay-600 text-white font-bold rounded-2xl hover:bg-agapay-700 transition-all hover:shadow-lg text-base"
                  >
                    Get Started — It is Free
                  </button>
                </div>
              </div>

              {/* Right — quick facts sidebar */}
              <div className="p-10 lg:p-14 flex flex-col justify-center gap-8 bg-gray-50/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-agapay-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="message-circle" size={20} className="text-agapay-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Talk, don't tap
                    </p>
                    <p className="text-sm text-gray-500">
                      Just tell Aramon what you need in English or Filipino.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-agapay-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="clock" size={20} className="text-agapay-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Book in seconds
                    </p>
                    <p className="text-sm text-gray-500">
                      No forms, no menus. Find and book care instantly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-agapay-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="shield-check" size={20} className="text-agapay-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Safe & private
                    </p>
                    <p className="text-sm text-gray-500">
                      Your health data stays secure and confidential.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-surface border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src={logo}
                  alt="AGAPAY"
                  className="w-9 h-9 rounded-xl object-contain"
                />
                <span className="text-lg font-bold text-gray-900">
                  AGAPAY
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Healthcare, connected around you. Built for every Filipino.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Product
              </p>
              <ul className="space-y-2.5">
                {["How It Works", "For Patients", "For Clinics", "Pricing"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-gray-500 hover:text-agapay-600 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </p>
              <ul className="space-y-2.5">
                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-agapay-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Get in Touch
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-agapay-50 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name="mail"
                      size={16}
                      className="text-agapay-600"
                    />
                  </div>
                  <a
                    href="mailto:hello@agapay.ph"
                    className="text-sm text-gray-500 hover:text-agapay-600 transition-colors"
                  >
                    hello@agapay.ph
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-agapay-50 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name="phone"
                      size={16}
                      className="text-agapay-600"
                    />
                  </div>
                  <a
                    href="tel:+639123456789"
                    className="text-sm text-gray-500 hover:text-agapay-600 transition-colors"
                  >
                    +63 912 345 6789
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-agapay-50 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name="map-pin"
                      size={16}
                      className="text-agapay-600"
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    Batangas City, Philippines
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2026 AGAPAY. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
