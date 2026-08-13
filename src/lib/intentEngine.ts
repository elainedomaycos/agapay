import type {
  Intent, ChatMessage, MessageCard, OptionItem, CardAction, BookingSession,
  BookingStep, Clinic, Doctor, Service, DateOption, TimePref, Appointment,
} from '../types';
import {
  MOCK_CLINICS, MOCK_HEALTH_RECORD, MOCK_QUEUE, MOCK_QR,
  SPECIALTIES, LOCATIONS,
} from '../data/mockData';
import {
  getAppointments, addAppointment, updateAppointment, upcomingAppointments,
} from './appointmentStore';

export interface EngineResult {
  messages: ChatMessage[];
  session: BookingSession;
}

/* ────────────────────────── helpers ────────────────────────── */

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function assistantMsg(text: string, card?: MessageCard, suggestions?: string[]): ChatMessage {
  return {
    id: makeId(),
    role: 'assistant',
    text,
    card,
    suggestions,
    timestamp: new Date(),
  };
}

function isFilipinoText(text: string): boolean {
  const t = text.toLowerCase();
  return (
    t.includes('gusto') || t.includes('magpa') || t.includes('anong') ||
    t.includes('saan') || t.includes('pakita') || t.includes('bukas') ||
    t.includes('mangyaring') || t.includes('salamat') || t.includes('opo') ||
    t.includes('sige') || t.includes('malapit')
  );
}

export function createBookingSession(): BookingSession {
  return { active: false, step: 'idle', clinics: [] };
}

/* ────────────────────────── intent matching ────────────────────────── */

export function matchIntent(text: string): Intent {
  const t = text.toLowerCase();

  const qrPatterns = ['qr', 'id card', 'agapay id', 'pakita ng qr', 'show my qr', 'show qr', 'aking qr'];
  if (qrPatterns.some(p => t.includes(p))) return 'VIEW_QR';

  const queuePatterns = ['queue', 'pila', 'number ko', 'anong number', "what's my number", 'my number', 'numero', 'queue number'];
  if (queuePatterns.some(p => t.includes(p))) return 'VIEW_QUEUE';

  const recordPatterns = [
    'record', 'show my record', 'pakita ng record', 'my records', 'health record',
    'last visit', 'last check-up', 'last check up', 'show me my last', 'show my check-up', 'show my check up',
    'naging check-up', 'nakaraang check-up',
    'diagnosis', 'result', 'lab result', 'ano result', 'anong result',
  ];
  if (recordPatterns.some(p => t.includes(p))) return 'VIEW_RECORD';

  const appointmentPatterns = ['appointment', 'anong schedule', 'schedule ko', 'may appointment', 'aking appointment', 'my appointment', 'my appointments', 'when is'];
  if (appointmentPatterns.some(p => t.includes(p))) return 'VIEW_APPOINTMENT';

  const bookPatterns = ['book', 'mag-book', 'magpa-book', 'set appointment', 'make an appointment', 'confirm booking'];
  if (bookPatterns.some(p => t.includes(p))) return 'BOOK_APPOINTMENT';

  const findCarePatterns = [
    'doctor', 'clinic', 'magpa-check', 'magpa check', 'find care', 'need care',
    'may doctor', 'nasaan', 'hanap', 'find a doctor', 'i need a', 'gusto kong',
    'saan', 'magpatingin', 'need help', 'feel sick', 'sick', 'sakit', 'pa-check',
    'masakit', 'sakit ng', 'where can i get', 'get checked', 'patingin', 'check-up', 'check up',
  ];
  if (findCarePatterns.some(p => t.includes(p))) return 'FIND_CARE';

  if (t.includes('need') || t.includes('want')) return 'BOOK_APPOINTMENT';

  return 'GENERAL_HELP';
}

/* ────────────────────────── slot extraction ────────────────────────── */

export function extractSpecialty(text: string): { key: string; label: string; icon: string } | undefined {
  const t = text.toLowerCase();
  for (const sp of SPECIALTIES) {
    if (sp.keywords.some(k => t.includes(k))) return sp;
  }
  return undefined;
}

const LOCATION_ALIASES: Array<{ terms: string[]; label: string }> = [
  { terms: ['lipa'], label: 'Lipa City' },
  { terms: ['tanauan'], label: 'Tanauan City' },
  { terms: ['lemery'], label: 'Lemery' },
  { terms: ['nasugbu'], label: 'Nasugbu' },
  { terms: ['batangas'], label: 'Batangas City' },
];

export function extractLocation(text: string): string | undefined {
  const t = text.toLowerCase();
  if (/(malapit|near me|here|dito|current location)/.test(t)) return 'Batangas City';
  for (const loc of LOCATION_ALIASES) {
    if (loc.terms.some(term => t.includes(term))) return loc.label;
  }
  return undefined;
}

export function extractTimePref(text: string): TimePref | undefined {
  const t = text.toLowerCase();
  if (/(morning|umaga)/.test(t)) return 'morning';
  if (/(afternoon|hapon)/.test(t)) return 'afternoon';
  if (/(evening|gabi|night)/.test(t)) return 'evening';
  return undefined;
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function extractDatePref(text: string): string | undefined {
  const t = text.toLowerCase();
  if (/(today|ngayon|this afternoon|later)/.test(t)) return 'Today';
  if (/(tomorrow|bukas)/.test(t)) return 'Tomorrow';
  for (let i = 0; i < DAYS.length; i++) {
    if (t.includes(DAYS[i])) {
      const now = new Date();
      const target = new Date(now);
      let delta = (i - now.getDay() + 7) % 7;
      if (delta === 0) delta = 7;
      target.setDate(now.getDate() + delta);
      return target.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  }
  if (t.includes('next week')) return 'Next week';
  return undefined;
}

/* ────────────────────────── clinic search ────────────────────────── */

function searchClinics(specialty: string | undefined, location: string | undefined): Clinic[] {
  const loc = location ?? 'Batangas City';
  const ranked = MOCK_CLINICS.map(clinic => {
    let match = 0;
    if (specialty && clinic.specialtyKeys.includes(specialty)) match += 3;
    if (clinic.city === loc) match += 1;
    return { clinic, match };
  }).sort((a, b) => b.match - a.match || a.clinic.distanceKm - b.clinic.distanceKm);
  return ranked.map(r => r.clinic);
}

/* ────────────────────────── message / card builders ────────────────────────── */

function specialtyOptions(): OptionItem[] {
  return SPECIALTIES.map(sp => ({ label: sp.label, icon: sp.icon, value: sp.key }));
}

function locationOptions(): OptionItem[] {
  return LOCATIONS.map(loc => ({ label: loc, icon: 'map-pin', value: `loc:${loc}` }));
}

function timePrefOptions(): OptionItem[] {
  return [
    { label: 'Morning', icon: 'sunrise', value: 'time:morning' },
    { label: 'Afternoon', icon: 'sun', value: 'time:afternoon' },
    { label: 'Evening', icon: 'sunset', value: 'time:evening' },
    { label: 'Any time', icon: 'clock', value: 'time:any' },
  ];
}

export function nextDates(): DateOption[] {
  const opts: DateOption[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const sub = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    opts.push({ key: d.toISOString().slice(0, 10), label, sub });
  }
  return opts;
}

export function defaultSlots(): string[] {
  return ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:30 PM'];
}

function hourOf(slot: string): number {
  const m = slot.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!m) return 12;
  let h = parseInt(m[1], 10);
  const meridiem = (m[3] || '').toUpperCase();
  if (meridiem === 'PM' && h !== 12) h += 12;
  if (meridiem === 'AM' && h === 12) h = 0;
  return h;
}

function slotsFor(clinic: Clinic, timePref: TimePref | undefined): string[] {
  let slots = clinic.slots;
  if (timePref === 'morning') slots = slots.filter(s => hourOf(s) < 12);
  if (timePref === 'afternoon') slots = slots.filter(s => hourOf(s) >= 12 && hourOf(s) < 17);
  if (timePref === 'evening') slots = slots.filter(s => hourOf(s) >= 17);
  return slots;
}

function formatPeso(amount: number): string {
  if (amount <= 0) return 'Free / varies';
  return `₱${amount.toLocaleString()}`;
}

/* ────────────────────────── booking dialogue ────────────────────────── */

function askSpecialty(): ChatMessage[] {
  return [
    assistantMsg(
      'Sige, let me find the right care for you. What kind of specialist are you looking for?',
      { type: 'options', options: specialtyOptions() },
      ['Dermatology', 'Pediatrics', 'General Check-up'],
    ),
  ];
}

function askLocation(session: BookingSession): ChatMessage[] {
  const dateNote = session.datePref
    ? ` You mentioned ${session.datePref}.`
    : ' ';
  return [
    assistantMsg(
      `Great — ${session.specialtyLabel ?? 'healthcare'} it is.${dateNote}Where are you located? I will find clinics near you.`,
      { type: 'options', options: locationOptions() },
      ['Batangas City', 'Lipa City'],
    ),
  ];
}

function askTimePref(session: BookingSession): ChatMessage[] {
  const locationNote = session.location ? ` near ${session.location}` : '';
  return [
    assistantMsg(
      `One more thing — what time would you prefer${locationNote}?`,
      { type: 'options', options: timePrefOptions() },
      ['Morning', 'Afternoon', 'Evening'],
    ),
  ];
}

function showClinicResults(session: BookingSession): EngineResult {
  const clinics = searchClinics(session.specialty, session.location);
  const next: BookingSession = { ...session, step: 'results', clinics };
  const heading = session.specialtyLabel
    ? `Here ${clinics.length > 1 ? 'are' : 'is'} ${clinics.length} clinic${clinics.length > 1 ? 's' : ''} for ${session.specialtyLabel} near ${session.location ?? 'you'}:`
    : `Here ${clinics.length > 1 ? 'are' : 'is'} ${clinics.length} clinic${clinics.length > 1 ? 's' : ''} near ${session.location ?? 'you'}:`;
  return {
    messages: [
      assistantMsg(heading, {
        type: 'clinic_list',
        data: { clinics },
      }, ['Show more clinics', 'Refine search', 'Cancel booking']),
    ],
    session: next,
  };
}

function bookingAskNext(session: BookingSession): EngineResult {
  const s: BookingSession = { ...session, active: true, step: 'collecting' };
  if (!s.specialty) return { messages: askSpecialty(), session: s };
  if (!s.location) return { messages: askLocation(s), session: s };
  if (!s.timePref) return { messages: askTimePref(s), session: s };
  return showClinicResults(s);
}

/* ────────────────────────── booking flow steps ────────────────────────── */

function clinicDetailMessage(clinic: Clinic): ChatMessage {
  return assistantMsg(
    `Here is the full profile of ${clinic.name}.`,
    {
      type: 'clinic_detail',
      data: { clinic },
      actions: [
        { type: 'book_clinic', label: 'Book Appointment', data: { clinicId: clinic.id } },
        { type: 'back_to_results', label: 'Back to Results', data: {} },
      ],
    },
  );
}

function doctorSelectMessage(session: BookingSession): ChatMessage[] {
  const clinic = session.clinic;
  if (!clinic) return showClinicResults(session).messages;
  return [
    assistantMsg(
      `Great choice! At ${clinic.name}, which doctor would you like to see?`,
      {
        type: 'doctor_select',
        data: { clinic, doctors: clinic.doctors },
      },
      clinic.doctors.map(d => d.name),
    ),
  ];
}

function serviceSelectMessage(session: BookingSession): ChatMessage[] {
  const clinic = session.clinic;
  if (!clinic) return showClinicResults(session).messages;
  return [
    assistantMsg(
      `And which service would you like at ${clinic.name}?`,
      {
        type: 'service_select',
        data: { clinic, services: clinic.services, doctor: session.doctor },
      },
    ),
  ];
}

function dateSelectMessage(session: BookingSession): ChatMessage[] {
  const dates = nextDates();
  const note = session.datePref
    ? ` You mentioned ${session.datePref} — pick a date below.`
    : '';
  return [
    assistantMsg(
      `When would you like to come in?${note}`,
      {
        type: 'date_select',
        data: { dates },
      },
    ),
  ];
}

function slotSelectMessage(session: BookingSession): ChatMessage[] {
  const clinic = session.clinic;
  const date = session.date;
  if (!clinic) return showClinicResults(session).messages;
  const slots = slotsFor(clinic, session.timePref);
  const dayNote = date ? ` on ${date.label} (${date.sub})` : '';
  const prefNote = session.timePref && session.timePref !== 'any' ? ` for ${session.timePref}` : '';
  return [
    assistantMsg(
      `Here are available time slots${dayNote}${prefNote}:`,
      {
        type: 'slot_select',
        data: { clinic, slots, date },
      },
    ),
  ];
}

function reviewMessage(session: BookingSession): ChatMessage[] {
  const preview: Appointment = previewFromSession(session);
  return [
    assistantMsg(
      'Here is your booking summary. Please review before confirming.',
      {
        type: 'booking_review',
        data: { appointment: preview },
        actions: [
          { type: 'confirm_booking', label: 'Confirm Booking', data: {} },
          { type: 'cancel_booking', label: 'Cancel', data: {} },
        ],
      },
    ),
  ];
}

function previewFromSession(session: BookingSession): Appointment {
  const clinic = session.clinic;
  return {
    id: 'preview',
    doctorName: session.doctor?.name ?? 'Any available doctor',
    doctorId: session.doctor?.id,
    specialty: clinic?.specialty ?? session.specialtyLabel ?? 'Healthcare',
    clinicName: clinic?.name ?? 'TBA',
    clinicAddress: clinic?.address,
    service: session.service?.name ?? 'Consultation',
    fee: session.service?.price ?? clinic?.consultationFee ?? 0,
    dateLabel: session.date?.label ?? session.datePref ?? 'Flexible',
    time: session.slot ?? 'Flexible',
    status: 'pending',
  };
}

/* ────────────────────────── confirm booking ────────────────────────── */

function confirmBooking(session: BookingSession): EngineResult {
  const clinic = session.clinic;
  const doctor = session.doctor;
  const service = session.service;
  const date = session.date;
  const slot = session.slot;

  if (!clinic || !doctor || !service || !date || !slot) {
    return bookingAskNext(session);
  }

  const appointment: Appointment = {
    id: `a${Date.now()}`,
    doctorName: doctor.name,
    doctorId: doctor.id,
    specialty: clinic.specialty,
    clinicName: clinic.name,
    clinicAddress: clinic.address,
    service: service.name,
    fee: service.price,
    dateLabel: `${date.label}, ${date.sub}`,
    time: slot,
    status: 'confirmed',
    reminder: false,
  };

  addAppointment(appointment);

  const confirmed: BookingSession = { ...session, active: false, step: 'confirmed' };
  return {
    messages: [
      assistantMsg(
        `Confirmed! Your appointment with ${doctor.name} at ${clinic.name} is set for ${date.label} at ${slot}.`,
        {
          type: 'booking_confirm',
          data: { appointment },
          actions: [
            { type: 'add_reminder', label: 'Add Reminder', data: { appointmentId: appointment.id } },
            { type: 'view_appointments', label: 'My Appointments', data: {} },
          ],
        },
      ),
    ],
    session: confirmed,
  };
}

function addReminderMessage(session: BookingSession, appointmentId?: string): ChatMessage[] {
  if (appointmentId) {
    updateAppointment(appointmentId, { reminder: true });
  }
  return [
    assistantMsg(
      'Reminder set! I will notify you before your appointment. You can manage reminders from My Appointments.',
      undefined,
      ['View my appointments', 'Book another appointment'],
    ),
  ];
}

/* ────────────────────────── public entry: card actions ────────────────────────── */

export function processCardAction(action: CardAction, session: BookingSession): EngineResult {
  const data = action.data ?? {};

  switch (action.type) {
    case 'view_clinic': {
      const clinic = MOCK_CLINICS.find(c => c.id === data.clinicId);
      if (!clinic) return showClinicResults(session);
      const next: BookingSession = { ...session, active: true, step: 'clinic', clinic };
      return { messages: [clinicDetailMessage(clinic)], session: next };
    }

    case 'book_clinic': {
      const clinic = MOCK_CLINICS.find(c => c.id === data.clinicId) ?? session.clinic;
      if (!clinic) return showClinicResults(session);
      const next: BookingSession = { ...session, active: true, step: 'doctor', clinic, doctor: undefined, service: undefined };
      return { messages: doctorSelectMessage(next), session: next };
    }

    case 'back_to_results':
      return showClinicResults(session);

    case 'select_doctor': {
      const doctor = session.clinic?.doctors.find(d => d.id === data.doctorId);
      if (!doctor) return { messages: doctorSelectMessage(session), session };
      const next: BookingSession = { ...session, step: 'service', doctor };
      return { messages: serviceSelectMessage(next), session: next };
    }

    case 'select_service': {
      const service = session.clinic?.services.find(s => s.id === data.serviceId);
      if (!service) return { messages: serviceSelectMessage(session), session };
      const next: BookingSession = { ...session, step: 'date', service };
      return { messages: dateSelectMessage(next), session: next };
    }

    case 'select_date': {
      const date = (data.date as DateOption | undefined) ?? session.date;
      if (!date) return { messages: dateSelectMessage(session), session };
      const next: BookingSession = { ...session, step: 'slot', date };
      return { messages: slotSelectMessage(next), session: next };
    }

    case 'select_slot': {
      const slot = typeof data.slot === 'string' ? data.slot : undefined;
      if (!slot) return { messages: slotSelectMessage(session), session };
      const next: BookingSession = { ...session, step: 'review', slot };
      return { messages: reviewMessage(next), session: next };
    }

    case 'confirm_booking':
      return confirmBooking(session);

    case 'add_reminder':
      return { messages: addReminderMessage(session, typeof data.appointmentId === 'string' ? data.appointmentId : undefined), session };

    case 'cancel_booking': {
      const next: BookingSession = createBookingSession();
      return {
        messages: [assistantMsg('No problem — booking cancelled. Let me know if you change your mind.')],
        session: next,
      };
    }

    default:
      return { messages: [assistantMsg('Got it. How can I help you further?')], session };
  }
}

/* ────────────────────────── public entry: option select ────────────────────────── */

export function processOptionSelect(option: OptionItem, session: BookingSession): EngineResult {
  const value = option.value;

  if (value.startsWith('loc:')) {
    const next: BookingSession = { ...session, active: true, location: value.slice(4) };
    return bookingAskNext(next);
  }

  if (value.startsWith('time:')) {
    const next: BookingSession = { ...session, active: true, timePref: value.slice(5) as TimePref };
    return bookingAskNext(next);
  }

  const specialty = SPECIALTIES.find(sp => sp.key === value);
  if (specialty) {
    const next: BookingSession = { ...session, active: true, specialty: specialty.key, specialtyLabel: specialty.label };
    return bookingAskNext(next);
  }

  return processMessage(option.label, session);
}

/* ────────────────────────── public entry: free text ────────────────────────── */

export function processMessage(userText: string, session: BookingSession): EngineResult {
  const intent = matchIntent(userText);
  const filipino = isFilipinoText(userText);

  switch (intent) {
    case 'FIND_CARE':
    case 'BOOK_APPOINTMENT': {
      return handleBooking(userText, session);
    }

    case 'VIEW_APPOINTMENT': {
      const upcoming = upcomingAppointments(getAppointments());
      if (upcoming.length === 0) {
        return {
          messages: [assistantMsg(
            filipino
              ? 'Wala pong naka-schedule na appointment sa ngayon. Gusto ninyo bang mag-book?'
              : 'You have no upcoming appointments right now. Would you like to book one?',
            undefined,
            ['Book an appointment'],
          )],
          session,
        };
      }
      const appt = upcoming[0];
      return {
        messages: [
          assistantMsg(
            filipino
              ? `Opo — meron po kayong appointment bukas ng ${appt.time} kay ${appt.doctorName}.`
              : `Yes — you have an appointment at ${appt.time} with ${appt.doctorName}.`,
            {
              type: 'appointment',
              data: { appointment: appt },
              actions: [
                { type: 'view_appointment', label: 'View Details', data: { appointmentId: appt.id } },
                { type: 'view_appointments', label: 'My Appointments', data: {} },
              ],
            },
          ),
        ],
        session,
      };
    }

    case 'VIEW_RECORD': {
      const intro = filipino
        ? 'Narito po ang inyong pinakabagong konsultasyon.'
        : 'Here is your most recent check-up record.';
      return {
        messages: [
          assistantMsg(intro, {
            type: 'health_record',
            data: { record: MOCK_HEALTH_RECORD },
          }, ['Ask Aramon about this', 'Show another record']),
        ],
        session,
      };
    }

    case 'VIEW_QR': {
      const intro = filipino
        ? 'Narito po ang inyong AGAPAY ID.'
        : 'Here is your AGAPAY QR ID. You can present this at any participating provider.';
      return {
        messages: [
          assistantMsg(intro, {
            type: 'qr_code',
            data: { qr: MOCK_QR },
          }),
        ],
        session,
      };
    }

    case 'VIEW_QUEUE': {
      const intro = filipino
        ? `Ang queue number ninyo ay ${MOCK_QUEUE.yourNumber}. Kasalukuyang pinaglilingkuran ang ${MOCK_QUEUE.nowServing}.`
        : `Your queue number is ${MOCK_QUEUE.yourNumber}. Currently serving: ${MOCK_QUEUE.nowServing}.`;
      return {
        messages: [
          assistantMsg(intro, {
            type: 'queue',
            data: { queue: MOCK_QUEUE },
          }, ['Notify me when it is my turn']),
        ],
        session,
      };
    }

    default: {
      const responses = filipino
        ? [
            'Kumusta po kayo ngayon? Maaari ninyong sabihin sa akin kung anong kailangan ninyo.',
            'Narito po ako para tumulong. Sabihin lang po sa akin kung anong kailangan ninyo.',
          ]
        : [
            "I am here to help you navigate your healthcare. You can ask me to find a clinic, book an appointment, check your schedule, or show your health records.",
            "Just tell me what you need and I will take care of it for you.",
          ];
      const idx = Math.floor(Math.random() * responses.length);
      return {
        messages: [
          assistantMsg(responses[idx], undefined, [
            'I need a dermatologist tomorrow afternoon',
            'Book an appointment',
            'Do I have an appointment tomorrow?',
            'Show my health records',
          ]),
        ],
        session,
      };
    }
  }
}

function handleBooking(userText: string, session: BookingSession): EngineResult {
  const filipino = isFilipinoText(userText);
  const next: BookingSession = { ...session, active: true, step: 'collecting' };

  const specialty = extractSpecialty(userText);
  if (specialty) {
    next.specialty = specialty.key;
    next.specialtyLabel = specialty.label;
  }
  const location = extractLocation(userText);
  if (location) next.location = location;
  const timePref = extractTimePref(userText);
  if (timePref) next.timePref = timePref;
  const datePref = extractDatePref(userText);
  if (datePref) next.datePref = datePref;

  const preview = next.specialtyLabel
    ? `Okay — let me find a ${next.specialtyLabel.toLowerCase()} appointment${location ? ` near ${location}` : ''}.`
    : filipino
      ? 'Sige po, tutulungan ko kayong maghanap ng tamang clinic.'
      : 'Of course! I can help you find care.';

  const lead = assistantMsg(preview);
  const result = bookingAskNext(next);
  return { messages: [lead, ...result.messages], session: result.session };
}
