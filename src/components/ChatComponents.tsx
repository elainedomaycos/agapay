import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, MessageCard, OptionItem, CardAction, Appointment } from '../types';
import {
  ClinicListCard, ClinicDetailCard, DoctorSelectCard, ServiceSelectCard,
  DateSelectCard, SlotSelectCard, BookingReviewCard,
} from './BookingCards';
import Icon from './Icon';

/* ── Assistant Avatar ── */
export function AssistantAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <div className={`${dim} bg-agapay-600 rounded-full flex items-center justify-center flex-shrink-0`}>
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2M12 3v4" />
      </svg>
    </div>
  );
}

/* ── Typing Indicator ── */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4 fade-up">
      <AssistantAvatar />
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-agapay-400 rounded-full"
              style={{
                animation: 'pulse-dot 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function renderCardActions(actions: unknown, onAction: (a: CardAction) => void): React.ReactNode {
  const list = actions as CardAction[] | undefined;
  if (!list || list.length === 0) return null;
  return <ActionButtons actions={list} onAction={onAction} />;
}

/* ── Action Buttons ── */
function ActionButtons({
  actions,
  onAction,
}: {
  actions: CardAction[];
  onAction: (a: CardAction) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {actions.map(a => (
        <button
          key={a.type + a.label}
          onClick={() => onAction(a)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            a.type === 'confirm_booking' || a.type === 'view_appointments' || a.type === 'book_clinic'
              ? 'bg-agapay-600 text-white hover:bg-agapay-700'
              : a.type === 'cancel_booking' || a.type === 'cancel_appointment'
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

/* ── Appointment Card ── */
function AppointmentCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const appt = data.appointment as Appointment;
  if (!appt) return null;
  const statusColor: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-600',
  };
  return (
    <div className="bg-white border border-agapay-100 rounded-2xl p-4 shadow-sm mt-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-agapay-100 rounded-xl flex items-center justify-center">
          <Icon name="calendar" size={16} className="text-agapay-600" />
        </div>
        <p className="text-xs font-semibold text-agapay-600 uppercase tracking-wide">Appointment</p>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ml-auto ${statusColor[appt.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
        </span>
      </div>
      <p className="font-semibold text-gray-900 text-lg">{appt.doctorName}</p>
      <p className="text-sm text-gray-500 mb-1">{appt.service}</p>
      <p className="text-sm text-gray-600">{appt.clinicName}</p>
      <div className="mt-3 bg-agapay-50 rounded-xl px-4 py-2.5">
        <p className="font-semibold text-agapay-800">{appt.dateLabel} · {appt.time}</p>
        <p className="text-xs text-agapay-600 mt-0.5">₱{appt.fee.toLocaleString()}</p>
      </div>
      {renderCardActions(data.actions, onAction)}
    </div>
  );
}

/* ── Health Record Card ── */
function HealthRecordCard({ data }: { data: Record<string, unknown> }) {
  const rec = data.record as {
    type: string; doctorName: string; clinicName: string; date: string;
  };
  if (!rec) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mt-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
          <Icon name="clipboard" size={16} className="text-green-600" />
        </div>
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Health Record</p>
      </div>
      <p className="font-semibold text-gray-900">{rec.type}</p>
      <p className="text-sm text-gray-500 mb-1">{rec.doctorName}</p>
      <p className="text-sm text-gray-500">{rec.clinicName}</p>
      <p className="text-xs text-gray-400 mt-2">{rec.date}</p>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          View Record
        </button>
        <button className="flex-1 py-2.5 bg-agapay-50 text-agapay-600 rounded-xl text-sm font-semibold hover:bg-agapay-100 transition-colors">
          Ask Aramon
        </button>
      </div>
    </div>
  );
}

/* ── QR Code Card ── */
function QRCodeCard({ data }: { data: Record<string, unknown> }) {
  const qr = data.qr as { name: string; agapayId: string };
  if (!qr) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mt-2 text-center">
      <div className="flex items-center gap-2 justify-center mb-4">
        <p className="text-xs font-semibold text-agapay-600 uppercase tracking-wide">Your AGAPAY ID</p>
      </div>
      <div className="w-40 h-40 mx-auto bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-32 h-32 opacity-80">
          <rect x="10" y="10" width="30" height="30" fill="none" stroke="#1B6FED" strokeWidth="4"/>
          <rect x="60" y="10" width="30" height="30" fill="none" stroke="#1B6FED" strokeWidth="4"/>
          <rect x="10" y="60" width="30" height="30" fill="none" stroke="#1B6FED" strokeWidth="4"/>
          <rect x="17" y="17" width="16" height="16" fill="#1B6FED"/>
          <rect x="67" y="17" width="16" height="16" fill="#1B6FED"/>
          <rect x="17" y="67" width="16" height="16" fill="#1B6FED"/>
          {[45,50,55,60].map(x => (
            [45,50,55,60,65,70].map(y => (
              <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill={Math.random() > 0.4 ? '#1B6FED' : 'transparent'} />
            ))
          ))}
          <rect x="45" y="45" width="4" height="4" fill="#1B6FED"/>
          <rect x="55" y="45" width="4" height="4" fill="#1B6FED"/>
          <rect x="65" y="65" width="4" height="4" fill="#1B6FED"/>
          <rect x="70" y="70" width="4" height="4" fill="#1B6FED"/>
          <rect x="50" y="60" width="4" height="4" fill="#1B6FED"/>
          <rect x="55" y="70" width="4" height="4" fill="#1B6FED"/>
          <rect x="45" y="70" width="4" height="4" fill="#1B6FED"/>
        </svg>
      </div>
      <p className="font-bold text-gray-900 text-lg">{qr.name}</p>
      <p className="text-sm font-mono text-agapay-600 bg-agapay-50 px-3 py-1 rounded-lg inline-block mt-1">{qr.agapayId}</p>
      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
        Present this QR at participating healthcare providers.
        Only authorized information will be shared.
      </p>
    </div>
  );
}

/* ── Queue Card ── */
function QueueCard({ data }: { data: Record<string, unknown> }) {
  const q = data.queue as {
    clinicName: string; yourNumber: string; nowServing: string; estimatedWait: string;
  };
  if (!q) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mt-2 text-center">
      <div className="flex items-center gap-2 justify-center mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Your Queue Number</p>
      </div>
      <p className="text-6xl font-extrabold text-agapay-700 tracking-tight mb-1">{q.yourNumber}</p>
      <div className="flex items-center justify-center gap-4 mt-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-400">Now Serving</p>
          <p className="text-xl font-bold text-gray-700">{q.nowServing}</p>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="text-center">
          <p className="text-xs text-gray-400">Est. Wait</p>
          <p className="text-xl font-bold text-agapay-600">{q.estimatedWait}</p>
        </div>
      </div>
      <button className="w-full py-3 bg-agapay-50 text-agapay-700 font-semibold rounded-xl hover:bg-agapay-100 transition-colors flex items-center justify-center gap-2">
        <Icon name="bell" size={16} />
        Notify Me
      </button>
    </div>
  );
}

/* ── Booking Confirm Card ── */
function BookingConfirmCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const b = data.appointment as Appointment;
  if (!b) return null;
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-sm mt-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-green-800">Appointment Confirmed</p>
      </div>
      <p className="font-semibold text-gray-900">{b.doctorName}</p>
      <p className="text-sm text-gray-500">{b.service} · {b.clinicName}</p>
      <div className="mt-2 bg-white rounded-xl px-4 py-2.5">
        <p className="font-semibold text-agapay-800">{b.dateLabel} · {b.time}</p>
        <p className="text-xs text-gray-400">{b.clinicAddress}</p>
        <p className="text-xs text-agapay-600 font-semibold mt-1">₱{b.fee.toLocaleString()}</p>
      </div>
      {renderCardActions(data.actions, onAction)}
    </div>
  );
}

/* ── Options Card ── */
function OptionsCard({ options, onSelect }: { options: OptionItem[]; onSelect: (opt: OptionItem) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-agapay-400 hover:bg-agapay-50 hover:text-agapay-700 transition-all"
        >
          {opt.icon && <Icon name={opt.icon} size={14} className="text-gray-500" />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Card Router ── */
function cardData(card: MessageCard): Record<string, unknown> {
  return { ...(card.data ?? {}), actions: card.actions };
}

function MessageCardView({
  card,
  onOptionSelect,
  onAction,
}: {
  card: MessageCard;
  onOptionSelect: (opt: OptionItem) => void;
  onAction: (a: CardAction) => void;
}) {
  switch (card.type) {
    case 'clinic_list':
      return card.data ? <ClinicListCard data={cardData(card)} onAction={onAction} /> : null;
    case 'clinic_detail':
      return card.data ? <ClinicDetailCard data={cardData(card)} onAction={onAction} /> : null;
    case 'doctor_select':
      return card.data ? <DoctorSelectCard data={cardData(card)} onAction={onAction} /> : null;
    case 'service_select':
      return card.data ? <ServiceSelectCard data={cardData(card)} onAction={onAction} /> : null;
    case 'date_select':
      return card.data ? <DateSelectCard data={cardData(card)} onAction={onAction} /> : null;
    case 'slot_select':
      return card.data ? <SlotSelectCard data={cardData(card)} onAction={onAction} /> : null;
    case 'booking_review':
      return card.data ? <BookingReviewCard data={cardData(card)} onAction={onAction} /> : null;
    case 'appointment':
      return card.data ? <AppointmentCard data={cardData(card)} onAction={onAction} /> : null;
    case 'health_record':
      return card.data ? <HealthRecordCard data={card.data} /> : null;
    case 'qr_code':
      return card.data ? <QRCodeCard data={card.data} /> : null;
    case 'queue':
      return card.data ? <QueueCard data={card.data} /> : null;
    case 'booking_confirm':
      return card.data ? <BookingConfirmCard data={cardData(card)} onAction={onAction} /> : null;
    case 'options':
      return card.options ? <OptionsCard options={card.options} onSelect={onOptionSelect} /> : null;
    default:
      return null;
  }
}

/* ── Single Chat Message ── */
export function ChatMessageView({
  message,
  onOptionSelect,
  onSuggestionClick,
  onCardAction,
}: {
  message: ChatMessage;
  onOptionSelect: (opt: OptionItem) => void;
  onSuggestionClick: (text: string) => void;
  onCardAction: (a: CardAction) => void;
}) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 fade-up">
        <div className="max-w-xs lg:max-w-sm">
          <div className="bg-agapay-600 text-white rounded-2xl rounded-br-sm px-5 py-3.5 shadow-sm">
            <p className="text-base leading-relaxed">{message.text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4 fade-up">
      <AssistantAvatar />
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm">
          <p className="text-base text-gray-800 leading-relaxed">{message.text}</p>
        </div>
        {message.card && (
          <div className="mt-1">
            <MessageCardView card={message.card} onOptionSelect={onOptionSelect} onAction={onCardAction} />
          </div>
        )}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.suggestions.map(s => (
              <button
                key={s}
                onClick={() => onSuggestionClick(s)}
                className="px-3.5 py-2 bg-agapay-50 text-agapay-700 rounded-xl text-sm font-medium hover:bg-agapay-100 transition-colors border border-agapay-100"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Quick Action Cards ── */
export function QuickActions({ onAction }: { onAction: (text: string) => void }) {
  const actions = [
    { label: 'Find Care', icon: 'stethoscope', text: 'Find a clinic near me', color: 'bg-blue-50 border-blue-100 hover:bg-blue-100' },
    { label: 'Book Appointment', icon: 'calendar', text: 'I need a dermatologist tomorrow afternoon', color: 'bg-purple-50 border-purple-100 hover:bg-purple-100' },
    { label: 'My Appointments', icon: 'calendar-days', text: 'Show my appointments', color: 'bg-green-50 border-green-100 hover:bg-green-100' },
    { label: 'My Health Records', icon: 'clipboard', text: 'Show me my last check-up', color: 'bg-amber-50 border-amber-100 hover:bg-amber-100' },
    { label: 'My AGAPAY QR', icon: 'qr', text: 'Show my QR', color: 'bg-pink-50 border-pink-100 hover:bg-pink-100' },
    { label: 'My Queue', icon: 'list-ordered', text: "What is my queue number?", color: 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
      {actions.map(action => (
        <button
          key={action.label}
          onClick={() => onAction(action.text)}
          className={`${action.color} border rounded-2xl p-4 text-left transition-all hover:shadow-sm active:scale-95`}
        >
          <Icon name={action.icon} size={24} className="mb-2 text-gray-700" />
          <p className="font-semibold text-gray-800 text-sm leading-tight">{action.label}</p>
        </button>
      ))}
    </div>
  );
}

/* ── Voice Modal ── */
export function VoiceModal({
  isOpen,
  onClose,
  onResult,
}: {
  isOpen: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}) {
  const [phase, setPhase] = useState<'listening' | 'processing' | 'done'>('listening');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const MOCK_PHRASE = 'Gusto kong magpa-check-up.';

  useEffect(() => {
    if (!isOpen) return;
    setPhase('listening');
    timerRef.current = setTimeout(() => {
      setPhase('processing');
      timerRef.current = setTimeout(() => {
        setPhase('done');
        timerRef.current = setTimeout(() => {
          onResult(MOCK_PHRASE);
          onClose();
        }, 600);
      }, 1200);
    }, 2400);
    return () => clearTimeout(timerRef.current);
  }, [isOpen, onClose, onResult]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-agapay-100 rounded-full animate-ping opacity-50" />
          <div className="relative w-24 h-24 bg-agapay-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-3.07A7 7 0 0 0 19 11z"/>
            </svg>
          </div>
        </div>

        {phase === 'listening' && (
          <>
            <p className="text-xl font-semibold text-gray-900 mb-2">Listening...</p>
            <p className="text-sm text-gray-500 mb-5">Say what you need</p>
            <div className="flex items-end justify-center gap-1 h-8">
              {[2, 4, 6, 3, 5, 2, 4, 6, 3].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-agapay-400 rounded-full animate-waveform"
                  style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </>
        )}

        {phase === 'processing' && (
          <>
            <p className="text-xl font-semibold text-gray-900 mb-2">Processing...</p>
            <div className="flex justify-center mt-2">
              <div className="w-6 h-6 border-2 border-agapay-600 border-t-transparent rounded-full animate-spin-slow" />
            </div>
          </>
        )}

        {phase === 'done' && (
          <>
            <p className="text-xl font-semibold text-gray-900 mb-2">Got it!</p>
            <p className="text-sm text-gray-500">{MOCK_PHRASE}</p>
          </>
        )}

        <button
          onClick={() => onClose()}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── Chat Input ── */
export function ChatInput({
  onSend,
  onVoice,
  disabled,
  seniorMode,
}: {
  onSend: (text: string) => void;
  onVoice: () => void;
  disabled?: boolean;
  seniorMode?: boolean;
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const micSize = seniorMode ? 'w-14 h-14' : 'w-12 h-12';
  const sendSize = seniorMode ? 'w-14 h-14' : 'w-12 h-12';

  return (
    <div className="bg-white border-t border-gray-100 px-4 py-3">
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-colors flex-shrink-0 mb-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-2xl flex items-end px-4 py-2.5">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKey}
            placeholder="Type a message... or tap the mic"
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400 text-base leading-relaxed max-h-28"
          />
        </div>

        <button
          onClick={onVoice}
          className={`${micSize} bg-agapay-100 text-agapay-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-agapay-200 transition-colors`}
          aria-label="Voice input"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
            <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-3.07A7 7 0 0 0 19 11z"/>
          </svg>
        </button>

        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={`${sendSize} rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            value.trim() && !disabled
              ? 'bg-agapay-600 text-white hover:bg-agapay-700'
              : 'bg-gray-100 text-gray-300'
          }`}
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
