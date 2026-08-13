import { useState } from "react"
import type { Screen, AppSettings } from "./types"
import { AppShell } from "./components/Layout"
import LandingScreen from "./screens/LandingScreen"
import AuthScreen from "./screens/AuthScreen"
import ChatScreen from "./screens/ChatScreen"
import HistoryScreen from "./screens/HistoryScreen"
import MyAppointmentsScreen from "./screens/MyAppointmentsScreen"
import AppointmentDetailScreen from "./screens/AppointmentDetailScreen"
import ProfileScreen from "./screens/ProfileScreen"
import SettingsScreen from "./screens/SettingsScreen"
import RoleSelectScreen from "./screens/RoleSelectScreen"
import ToastContainer from "./components/ToastContainer"
import AdminLayout from "./screens/admin/AdminLayout"
import AdminLoginScreen from "./screens/admin/AdminLoginScreen"
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen"
import AdminAppointmentsScreen from "./screens/admin/AdminAppointmentsScreen"
import AdminCalendarScreen from "./screens/admin/AdminCalendarScreen"
import AdminDoctorsScreen from "./screens/admin/AdminDoctorsScreen"
import AdminServicesScreen from "./screens/admin/AdminServicesScreen"
import AdminPatientsScreen from "./screens/admin/AdminPatientsScreen"
import AdminClinicScreen from "./screens/admin/AdminClinicScreen"
import AdminVisibilityScreen from "./screens/admin/AdminVisibilityScreen"
import AdminAnalyticsScreen from "./screens/admin/AdminAnalyticsScreen"
import AdminStaffScreen from "./screens/admin/AdminStaffScreen"

const ADMIN_SCREENS: Screen[] = [
  "admin-dashboard",
  "admin-appointments",
  "admin-calendar",
  "admin-doctors",
  "admin-services",
  "admin-patients",
  "admin-clinic",
  "admin-visibility",
  "admin-analytics",
  "admin-staff",
]

const DEFAULT_SETTINGS: AppSettings = {
  seniorMode: false,
  language: "English",
  highContrast: false,
  voiceAssistance: false,
  notifications: true,
  textSize: "normal",
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing")
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [chatKey, setChatKey] = useState(0)
  const [appointmentId, setAppointmentId] = useState<string | undefined>(
    undefined,
  )

  const navigate = (s: Screen, data?: unknown) => {
    if (s === "appointment-detail") {
      setAppointmentId(typeof data === "string" ? data : undefined)
    }
    setScreen(s)
  }
  const patchSettings = (patch: Partial<AppSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }))
  const newChat = () => {
    setChatKey((k) => k + 1)
    setScreen("chat")
  }

  const renderScreen = () => {
    switch (screen) {
      case "landing":
        return <LandingScreen onNavigate={navigate} />

      case "role-select":
        return <RoleSelectScreen onNavigate={navigate} />

      case "admin-login":
        return <AdminLoginScreen onNavigate={navigate} />

      case "admin-dashboard":
        return <AdminDashboardScreen onNavigate={navigate} />

      case "admin-appointments":
        return <AdminAppointmentsScreen />

      case "admin-calendar":
        return <AdminCalendarScreen />

      case "admin-doctors":
        return <AdminDoctorsScreen />

      case "admin-services":
        return <AdminServicesScreen />

      case "admin-patients":
        return <AdminPatientsScreen />

      case "admin-clinic":
        return <AdminClinicScreen />

      case "admin-visibility":
        return <AdminVisibilityScreen />

      case "admin-analytics":
        return <AdminAnalyticsScreen />

      case "admin-staff":
        return <AdminStaffScreen />

      case "login":
        return <AuthScreen mode="login" onNavigate={navigate} />

      case "register":
        return <AuthScreen mode="register" onNavigate={navigate} />

      case "otp":
        return <AuthScreen mode="otp" onNavigate={navigate} />

      case "welcome":
        return <AuthScreen mode="welcome" onNavigate={navigate} />

      case "chat":
        return (
          <ChatScreen key={chatKey} onNavigate={navigate} settings={settings} />
        )

      case "history":
        return <HistoryScreen onNavigate={navigate} settings={settings} />

      case "appointments":
        return (
          <MyAppointmentsScreen onNavigate={navigate} settings={settings} />
        )

      case "appointment-detail":
        return (
          <AppointmentDetailScreen
            onNavigate={navigate}
            settings={settings}
            appointmentId={appointmentId}
          />
        )

      case "profile":
        return <ProfileScreen onNavigate={navigate} settings={settings} />

      case "settings":
        return (
          <SettingsScreen
            onNavigate={navigate}
            settings={settings}
            onSettingsChange={patchSettings}
          />
        )

      default:
        return <LandingScreen onNavigate={navigate} />
    }
  }

  const isAdminArea = ADMIN_SCREENS.includes(screen)
  const isStandalone =
    screen === "landing" ||
    screen === "role-select" ||
    screen === "admin-login" ||
    screen === "login" ||
    screen === "register" ||
    screen === "otp" ||
    screen === "welcome"

  if (isStandalone || isAdminArea) {
    return (
      <>
        {isAdminArea ? (
          <AdminLayout current={screen} onNavigate={navigate}>
            {renderScreen()}
          </AdminLayout>
        ) : (
          renderScreen()
        )}
        <ToastContainer />
      </>
    )
  }

  return (
    <>
      <AppShell
        currentScreen={screen}
        onNavigate={navigate}
        onNewChat={newChat}
        settings={settings}
      >
        {renderScreen()}
      </AppShell>
      <ToastContainer />
    </>
  )
}
