import { useState, useRef, useEffect, useCallback } from "react"
import type {
  Screen,
  ChatMessage,
  OptionItem,
  CardAction,
  AppSettings,
} from "../types"
import { MOCK_USER } from "../data/mockData"
import {
  processMessage,
  processOptionSelect,
  processCardAction,
  createBookingSession,
} from "../lib/intentEngine"
import type { EngineResult } from "../lib/intentEngine"
import {
  ChatMessageView,
  QuickActions,
  ChatInput,
  VoiceModal,
  TypingIndicator,
  AssistantAvatar,
} from "../components/ChatComponents"
import { MobileHeader, MobileMenu } from "../components/Layout"
import { showToast } from "../lib/toastStore"
import { Skeleton, useSimulatedLoading } from "../components/Skeleton"

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    text: `Good morning, ${MOCK_USER.firstName}! I am Aramon, your AGAPAY healthcare assistant. Just tell me what you need — in English or Filipino.`,
    suggestions: [],
    timestamp: new Date(),
  },
]

interface Props {
  onNavigate: (s: Screen, data?: unknown) => void
  settings: AppSettings
}

export default function ChatScreen({ onNavigate, settings }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [booking, setBooking] = useState(createBookingSession)
  const [isTyping, setIsTyping] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const initialLoading = useSimulatedLoading(250)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const fallbackMessages = (fallback: string): ChatMessage[] => [
    {
      id: `err-${Date.now()}`,
      role: "assistant",
      text: fallback,
      suggestions: ["Try again", "Book an appointment"],
      timestamp: new Date(),
    },
  ]

  const runEngine = useCallback(
    (task: () => EngineResult, fallback: string): EngineResult => {
      try {
        return task()
      } catch {
        showToast("Something went wrong. Please try again.", "error")
        return { session: booking, messages: fallbackMessages(fallback) }
      }
    },
    [booking],
  )

  const addUserMessage = (text: string) => {
    const msg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, msg])
    setShowQuickActions(false)
    return msg
  }

  const addAssistantMessages = useCallback((responses: ChatMessage[]) => {
    setIsTyping(false)
    setMessages((prev) => [...prev, ...responses])
  }, [])

  const applyResult = useCallback(
    (res: EngineResult) => {
      setBooking(res.session)
      addAssistantMessages(res.messages)
    },
    [addAssistantMessages],
  )

  const handleSend = (text: string) => {
    addUserMessage(text)
    setIsTyping(true)
    const delay = 300 + Math.random() * 200
    setTimeout(() => {
      const res = runEngine(
        () => processMessage(text, booking),
        "Sorry, I had trouble processing that. Please try again.",
      )
      applyResult(res)
    }, delay)
  }

  const handleOptionSelect = (opt: OptionItem) => {
    addUserMessage(opt.label)
    setIsTyping(true)
    setTimeout(() => {
      const res = runEngine(
        () => processOptionSelect(opt, booking),
        "Sorry, I could not process that option. Please try again.",
      )
      applyResult(res)
    }, 350)
  }

  const handleSuggestionClick = (text: string) => {
    handleSend(text)
  }

  const handleCardAction = (action: CardAction) => {
    if (action.type === "view_appointments") {
      onNavigate("appointments")
      return
    }
    if (action.type === "view_appointment") {
      onNavigate("appointment-detail", action.data?.appointmentId)
      return
    }
    if (action.type === "view_clinic" || action.type === "book_clinic") {
      addUserMessage(`Viewing ${action.label}...`)
    } else if (action.type === "confirm_booking") {
      addUserMessage("Confirm booking")
    } else if (action.type === "select_slot") {
      addUserMessage(`Pick ${action.label}`)
    } else if (action.type === "select_date") {
      addUserMessage(`Pick ${action.label}`)
    } else if (action.type === "select_doctor") {
      addUserMessage(`Choose ${action.label}`)
    } else if (action.type === "select_service") {
      addUserMessage(`Choose ${action.label}`)
    }
    setIsTyping(true)
    setTimeout(() => {
      const res = runEngine(
        () => processCardAction(action, booking),
        "Sorry, that action failed. Please try again.",
      )
      applyResult(res)
      if (res.session.step === "confirmed") {
        showToast("Appointment confirmed", "success")
      } else if (action.type === "add_reminder") {
        showToast("Reminder set", "success")
      } else if (action.type === "cancel_booking") {
        showToast("Appointment cancelled", "info")
      }
    }, 350)
  }

  const handleVoiceResult = (text: string) => {
    handleSend(text)
  }

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  })()

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader
          onNavigate={onNavigate}
          onMenuOpen={() => setMenuOpen(true)}
        />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        currentScreen="chat"
      />

      {/* Desktop Chat Header */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <AssistantAvatar />
          <div>
            <p className="font-semibold text-gray-900">Aramon</p>
            <p className="text-sm text-gray-400">
              Your AGAPAY healthcare assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-sm text-gray-400">Active</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Greeting banner (only when empty) */}
          {showQuickActions && !initialLoading && (
            <div className="text-center mb-8 fade-up">
              <p className="text-2xl font-semibold text-gray-700 mb-1">
                {greeting}, {MOCK_USER.firstName}
              </p>
              <p className="text-gray-400 text-lg">How can I help you today?</p>
            </div>
          )}

          {/* Initial loading skeleton */}
          {initialLoading && (
            <div className="space-y-3 py-2">
              <div className="flex items-end gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-9 w-40 rounded-2xl" />
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <ChatMessageView
              key={msg.id}
              message={msg}
              onOptionSelect={handleOptionSelect}
              onSuggestionClick={handleSuggestionClick}
              onCardAction={handleCardAction}
            />
          ))}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}

          {/* Quick action cards */}
          {showQuickActions && !isTyping && (
            <div className="mt-4 fade-up">
              <p className="text-sm text-gray-400 mb-4 font-medium">
                Quick actions
              </p>
              <QuickActions onAction={handleSend} />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onVoice={() => setShowVoice(true)}
        disabled={isTyping}
        seniorMode={settings.seniorMode}
      />

      {/* Voice Modal */}
      <VoiceModal
        isOpen={showVoice}
        onClose={() => setShowVoice(false)}
        onResult={handleVoiceResult}
      />
    </div>
  )
}
