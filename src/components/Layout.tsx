import { useState } from 'react';
import type { Screen, AppSettings } from '../types';
import { useAppointments } from '../lib/appointmentStore';
import Icon from './Icon';
import logo from '../logo.png';

interface NavItem {
  label: string;
  icon: string;
  screen: Screen;
}

const navItems: NavItem[] = [
  { label: 'Conversations', icon: 'message-circle', screen: 'chat' },
  { label: 'My Appointments', icon: 'calendar-days', screen: 'appointments' },
  { label: 'My Health Records', icon: 'clipboard', screen: 'chat' },
  { label: 'My AGAPAY ID', icon: 'id-card', screen: 'chat' },
  { label: 'My Queue', icon: 'list-ordered', screen: 'chat' },
];

const toolItems: Array<{ label: string; icon: string; screen: Screen }> = [
  { label: 'Settings', icon: 'settings', screen: 'settings' },
  { label: 'Help & Support', icon: 'lightbulb', screen: 'chat' },
];

/* ── Mobile Header ── */
export function MobileHeader({
  onNavigate,
  onMenuOpen,
}: {
  onNavigate: (screen: Screen) => void;
  onMenuOpen: () => void;
}) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuOpen}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src={logo} alt="AGAPAY" className="w-8 h-8 rounded-lg object-contain" />
          <div>
            <p className="font-bold text-gray-900 leading-tight">AGAPAY</p>
            <p className="text-[10px] text-gray-400 leading-tight">Aramon Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('chat')}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Home"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
            </svg>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Profile"
          >
            <div className="w-8 h-8 bg-agapay-100 rounded-full flex items-center justify-center text-agapay-700 text-sm font-semibold">
              JD
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── Mobile Menu Drawer ── */
export function MobileMenu({
  isOpen,
  onClose,
  onNavigate,
  currentScreen,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src={logo} alt="AGAPAY" className="w-9 h-9 rounded-xl object-contain" />
            <div>
              <p className="font-bold text-gray-900">AGAPAY</p>
              <p className="text-xs text-gray-400">Aramon Assistant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.screen);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                currentScreen === item.screen
                  ? 'bg-agapay-50 text-agapay-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon name={item.icon} size={18} className="text-gray-500" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          {toolItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.screen);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Icon name={item.icon} size={18} className="text-gray-500" />
              {item.label}
            </button>
          ))}
          <div className="flex items-center gap-3 px-3 py-3 mt-2">
            <div className="w-9 h-9 bg-agapay-100 rounded-full flex items-center justify-center text-agapay-700 font-semibold">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Juan Dela Cruz</p>
              <p className="text-xs text-gray-400">Juan Dela Cruz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Desktop Sidebar ── */
function DesktopSidebar({
  currentScreen,
  onNavigate,
  onNewChat,
  upcomingDate,
}: {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onNewChat: () => void;
  upcomingDate?: string;
}) {
  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-white border-r border-gray-100 flex-shrink-0 sticky top-0">
      <div className="p-5">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="AGAPAY" className="w-10 h-10 rounded-xl object-contain" />
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight">AGAPAY</p>
            <p className="text-xs text-gray-400">Aramon Assistant</p>
          </div>
        </div>
        <button
          onClick={onNewChat}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-agapay-600 text-white rounded-xl text-sm font-semibold hover:bg-agapay-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.screen)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentScreen === item.screen
                ? 'bg-agapay-50 text-agapay-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            >
              <Icon name={item.icon} size={18} className="text-gray-500" />
              {item.label}
              {item.screen === 'appointments' && upcomingDate && (
              <span className="ml-auto text-xs bg-agapay-100 text-agapay-700 font-semibold rounded-full px-2 py-0.5">
                {upcomingDate}
              </span>
            )}
          </button>
        ))}
      </nav>

      {upcomingDate && (
        <div className="px-4 pb-2">
          <div className="bg-agapay-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-agapay-600 uppercase tracking-wide mb-2">Upcoming</p>
            <p className="text-sm text-gray-600">{upcomingDate}</p>
            <button
              onClick={() => onNavigate('appointments')}
              className="mt-3 w-full py-2 bg-white text-agapay-700 rounded-xl text-sm font-semibold hover:bg-agapay-100 transition-colors"
            >
              View details →
            </button>
          </div>
        </div>
      )}

      <div className="p-3 border-t border-gray-100 space-y-1">
        {toolItems.map(item => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.screen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Icon name={item.icon} size={18} className="text-gray-500" />
            {item.label}
          </button>
        ))}
        <div className="flex items-center gap-3 px-3 py-3 mt-2">
          <div className="w-9 h-9 bg-agapay-100 rounded-full flex items-center justify-center text-agapay-700 font-semibold">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Juan Dela Cruz</p>
            <p className="text-xs text-gray-400">Juan Dela Cruz</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── App Shell ── */
export function AppShell({
  currentScreen,
  onNavigate,
  onNewChat,
  settings,
  children,
}: {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onNewChat: () => void;
  settings: AppSettings;
  children: React.ReactNode;
}) {
  const appointments = useAppointments();
  const upcoming = appointments.find(
    a => a.status === 'confirmed' || a.status === 'pending',
  );

  return (
    <div className="h-screen flex bg-gray-50">
      <DesktopSidebar
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        onNewChat={onNewChat}
        upcomingDate={upcoming?.dateLabel}
      />
      <main className="flex-1 h-screen overflow-y-auto smooth-scroll">
        <div className={`h-full ${settings.seniorMode ? 'senior-mode' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
