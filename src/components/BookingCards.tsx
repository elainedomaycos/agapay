import type { CardAction, Clinic, Service, Doctor, DateOption, Appointment } from '../types';
import Icon from './Icon';

export function renderActions(actions: CardAction[] | undefined, onAction: (a: CardAction) => void): React.ReactNode {
  if (!actions || actions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {actions.map(a => (
        <button
          key={a.type + a.label}
          onClick={() => onAction(a)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            a.type === 'confirm_booking' || a.type === 'book_clinic'
              ? 'bg-agapay-600 text-white hover:bg-agapay-700'
              : a.type === 'cancel_booking'
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

function ActionRow({ actions, onAction }: { actions: CardAction[] | undefined; onAction: (a: CardAction) => void }) {
  return renderActions(actions, onAction);
}

/* ── Clinic List Card ── */
export function ClinicListCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const clinics = data.clinics as Clinic[];
  const intro = data.intro as string | undefined;
  if (!clinics || clinics.length === 0) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-2 overflow-hidden">
      <div className="px-4 pt-4">
        <p className="font-bold text-gray-900">{clinics.length} clinics found</p>
        {intro && <p className="text-xs text-gray-500 mt-0.5">{intro}</p>}
      </div>
      <div className="divide-y divide-gray-100 mt-2">
        {clinics.map(c => (
          <button
            key={c.id}
            onClick={() => onAction({ type: 'view_clinic', label: `View ${c.name}`, data: { clinicId: c.id } })}
            className="w-full text-left px-4 py-3 flex gap-3 hover:bg-agapay-50/50 transition-colors"
          >
            <div className="w-14 h-14 bg-agapay-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name={c.image} size={26} className="text-agapay-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                <span className="text-xs text-agapay-600 font-medium flex-shrink-0">{c.distanceKm} km</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{c.city} · {c.nextAvailable}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-amber-500">★</span>
                <span className="text-xs font-semibold text-gray-600">{c.rating}</span>
                {c.isOpen && <span className="text-xs text-green-600 font-medium ml-1">Open now</span>}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between flex-shrink-0">
              <span className="text-xs text-gray-400 font-medium">{c.specialtyKeys[0]}</span>
              <span className="text-xs text-green-600 font-semibold">View</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Clinic Detail Card ── */
export function ClinicDetailCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const clinic = data.clinic as Clinic;
  const actions = data.actions as CardAction[] | undefined;
  if (!clinic) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-2 overflow-hidden">
      <div className="h-28 bg-gradient-to-br from-agapay-400 to-agapay-700 relative flex items-center justify-center">
        <Icon name={clinic.image} size={48} className="text-white" />
        <span className="absolute top-2 right-2 bg-white/90 text-xs font-semibold text-agapay-700 px-2 py-1 rounded-full">
          {clinic.distanceKm} km
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{clinic.name}</p>
            <p className="text-xs text-gray-500">{clinic.specialty}</p>
          </div>
          <div className="text-right">
            <span className="text-amber-500">★</span>
            <span className="text-sm font-semibold">{clinic.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{clinic.description}</p>

        <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-600">
          <svg className="w-4 h-4 text-agapay-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{clinic.city}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{clinic.address}</p>

        <div className="mt-3 bg-agapay-50 rounded-xl px-3 py-2">
          <p className="text-xs font-semibold text-agapay-700 mb-1">Operating Hours</p>
          <div className="flex flex-col gap-0.5">
            {clinic.operatingHours.map(h => (
              <span key={h.day} className="text-xs text-gray-600">
                {h.day}: {h.hours}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Services</p>
          <div className="space-y-1.5">
            {clinic.services.map(s => (
              <div key={s.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{s.name}</span>
                <span className="font-semibold text-agapay-600">₱{s.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Doctors</p>
          <div className="space-y-1.5">
            {clinic.doctors.map(d => (
              <button
                key={d.id}
                onClick={() => onAction({ type: 'select_doctor', label: `Select ${d.name}`, data: { doctorId: d.id } })}
                className="w-full flex items-center gap-2 text-sm bg-gray-50 rounded-xl px-3 py-2 hover:bg-agapay-50 transition-colors text-left"
              >
                <div className="w-7 h-7 bg-agapay-100 rounded-full flex items-center justify-center text-agapay-700 text-xs font-bold flex-shrink-0">
                  {d.name.split(' ').slice(-1)[0][0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.specialty}{d.years ? ` · ${d.years} yrs` : ''}</p>
                </div>
                <span className="text-agapay-600 text-xs font-semibold">Select →</span>
              </button>
            ))}
          </div>
        </div>

        <ActionRow actions={actions} onAction={onAction} />
      </div>
    </div>
  );
}

/* ── Doctor Select Card ── */
export function DoctorSelectCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const doctors = data.doctors as Doctor[];
  const clinicName = data.clinicName as string | undefined;
  const actions = data.actions as CardAction[] | undefined;
  if (!doctors || doctors.length === 0) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-2 overflow-hidden">
      <div className="px-4 pt-4">
        <p className="font-bold text-gray-900">Choose a doctor</p>
        {clinicName && <p className="text-xs text-gray-500 mt-0.5">{clinicName}</p>}
      </div>
      <div className="divide-y divide-gray-100 mt-2">
        {doctors.map(d => (
          <div key={d.id} className="px-4 py-3 flex items-center gap-3">
            <div className="w-12 h-12 bg-agapay-100 rounded-full flex items-center justify-center text-agapay-700 font-bold flex-shrink-0">
              {d.name.split(' ').slice(-1)[0][0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{d.name}</p>
              <p className="text-xs text-gray-500">{d.specialty}</p>
              {d.title && <p className="text-xs text-green-600 mt-0.5">{d.title}</p>}
            </div>
            <button
              onClick={() => onAction({ type: 'select_doctor', label: `Select ${d.name}`, data: { doctorId: d.id } })}
              className="px-4 py-2 bg-agapay-50 text-agapay-700 rounded-xl text-sm font-semibold hover:bg-agapay-100 transition-colors flex-shrink-0"
            >
              Select
            </button>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <ActionRow actions={actions} onAction={onAction} />
      </div>
    </div>
  );
}

/* ── Service Select Card ── */
export function ServiceSelectCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const services = data.services as Service[];
  const clinicName = data.clinicName as string | undefined;
  const actions = data.actions as CardAction[] | undefined;
  if (!services || services.length === 0) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-2 overflow-hidden">
      <div className="px-4 pt-4">
        <p className="font-bold text-gray-900">Choose a service</p>
        {clinicName && <p className="text-xs text-gray-500 mt-0.5">{clinicName}</p>}
      </div>
      <div className="divide-y divide-gray-100 mt-2">
        {services.map(s => (
          <div key={s.id} className="px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-agapay-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="stethoscope" size={18} className="text-agapay-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
              <p className="text-xs text-gray-500">{s.duration}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-semibold text-agapay-600 text-sm">₱{s.price.toLocaleString()}</span>
              <button
                onClick={() => onAction({ type: 'select_service', label: `Select ${s.name}`, data: { serviceId: s.id } })}
                className="px-4 py-2 bg-agapay-50 text-agapay-700 rounded-xl text-sm font-semibold hover:bg-agapay-100 transition-colors"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <ActionRow actions={actions} onAction={onAction} />
      </div>
    </div>
  );
}

/* ── Date Select Card ── */
export function DateSelectCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const dates = data.dates as DateOption[];
  const actions = data.actions as CardAction[] | undefined;
  if (!dates || dates.length === 0) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-2 overflow-hidden">
      <div className="px-4 pt-4">
        <p className="font-bold text-gray-900">Pick a date</p>
        <p className="text-xs text-gray-500 mt-0.5">Available days for your visit</p>
      </div>
      <div className="px-4 py-3 grid grid-cols-4 gap-2">
        {dates.map(d => (
          <button
            key={d.key}
            onClick={() => onAction({ type: 'select_date', label: d.label, data: { date: d } })}
            className="border border-gray-200 rounded-xl py-2.5 text-center hover:border-agapay-400 hover:bg-agapay-50 transition-colors"
          >
            <p className="text-[10px] text-gray-400 uppercase">{d.sub}</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{d.label}</p>
          </button>
        ))}
      </div>
      <div className="px-4 pb-4">
        <ActionRow actions={actions} onAction={onAction} />
      </div>
    </div>
  );
}

/* ── Slot Select Card ── */
export function SlotSelectCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const slots = data.slots as string[];
  const doctorName = data.doctorName as string | undefined;
  const actions = data.actions as CardAction[] | undefined;
  if (!slots || slots.length === 0) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-2 overflow-hidden">
      <div className="px-4 pt-4">
        <p className="font-bold text-gray-900">Pick a time</p>
        {doctorName && <p className="text-xs text-gray-500 mt-0.5">Dr. {doctorName}</p>}
      </div>
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        {slots.map(s => (
          <button
            key={s}
            onClick={() => onAction({ type: 'select_slot', label: s, data: { slot: s } })}
            className="border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:border-agapay-400 hover:bg-agapay-50 hover:text-agapay-700 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="px-4 pb-4">
        <ActionRow actions={actions} onAction={onAction} />
      </div>
    </div>
  );
}

/* ── Booking Review Card ── */
export function BookingReviewCard({
  data,
  onAction,
}: {
  data: Record<string, unknown>;
  onAction: (a: CardAction) => void;
}) {
  const appt = data.appointment as Appointment;
  const actions = data.actions as CardAction[] | undefined;
  if (!appt) return null;
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Doctor', value: appt.doctorName },
    { label: 'Specialty', value: appt.specialty },
    { label: 'Service', value: appt.service },
    { label: 'Clinic', value: appt.clinicName },
    { label: 'Date', value: appt.dateLabel },
    { label: 'Time', value: appt.time },
    { label: 'Fee', value: `₱${appt.fee.toLocaleString()}` },
  ];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-2 overflow-hidden">
      <div className="px-4 pt-4">
        <p className="font-bold text-gray-900">Review your booking</p>
        <p className="text-xs text-gray-500 mt-0.5">Please confirm the details below</p>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between text-sm gap-4">
            <span className="text-gray-500 flex-shrink-0">{row.label}</span>
            <span className="text-gray-900 font-medium text-right">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <ActionRow actions={actions} onAction={onAction} />
      </div>
    </div>
  );
}
