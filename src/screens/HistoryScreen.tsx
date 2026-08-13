import { useState } from "react"
import type { Screen, AppSettings } from "../types"
import { MOCK_HISTORY } from "../data/mockData"
import { MobileHeader, MobileMenu } from "../components/Layout"
import Reveal from "../components/Reveal"
import { RowSkeleton, useSimulatedLoading } from "../components/Skeleton"
import Icon from "../components/Icon"

interface Props {
  onNavigate: (s: Screen) => void
  settings: AppSettings
}

export default function HistoryScreen({ onNavigate, settings }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const loading = useSimulatedLoading(250)
  const grouped = MOCK_HISTORY.reduce<Record<string, typeof MOCK_HISTORY>>(
    (acc, item) => {
      const key = item.dateLabel
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {},
  )

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
        currentScreen="history"
      />

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Your Conversations</h1>
        <button
          onClick={() => onNavigate("chat")}
          className="flex items-center gap-2 px-4 py-2.5 bg-agapay-600 text-white rounded-xl text-sm font-semibold hover:bg-agapay-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900">
              Your Conversations
            </h1>
            <button
              onClick={() => onNavigate("chat")}
              className="flex items-center gap-2 px-3 py-2 bg-agapay-600 text-white rounded-xl text-sm font-semibold"
            >
              + New
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          ) : Object.entries(grouped).length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
              <div className="w-16 h-16 bg-agapay-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="message-circle" size={32} className="text-agapay-600" />
              </div>
              <p className="font-semibold text-gray-800 text-lg mb-1">
                No conversations yet
              </p>
              <p className="text-sm text-gray-400 mb-5">
                Start a chat with Aramon and your conversations will appear
                here.
              </p>
              <button
                onClick={() => onNavigate("chat")}
                className="px-6 py-3 bg-agapay-600 text-white rounded-xl font-semibold hover:bg-agapay-700 transition-colors"
              >
                Start a Conversation
              </button>
            </div>
          ) : Object.entries(grouped).map(([label, items]) => (
            <div key={label} className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {label}
              </p>
              <div className="flex flex-col gap-3">
                {items.map((item, i) => (
                  <Reveal key={item.id} delay={i * 60}>
                    <button
                      onClick={() => onNavigate("chat")}
                      className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-agapay-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-agapay-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg
                            className="w-5 h-5 text-agapay-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 mb-0.5">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {item.preview}
                          </p>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-300 flex-shrink-0 mt-2"
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
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
