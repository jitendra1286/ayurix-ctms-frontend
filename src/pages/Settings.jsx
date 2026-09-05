import { useState } from "react"
import {
  Settings as SettingsIcon,
  UserRound,
  Bell,
  ShieldCheck,
  Database,
  Save,
  LockKeyhole,
  Mail,
  Smartphone,
  Globe,
  Clock3,
  CheckCircle2,
} from "lucide-react"

function Settings() {
  const [activeTab, setActiveTab] = useState("profile")

  const [profile, setProfile] = useState({
    name: "Dr. Meera Sharma",
    email: "meera.sharma@aiia.gov.in",
    role: "Researcher",
    phone: "+91 98765 43210",
    organization: "AIIA Clinical Research Department",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    safetyAlerts: true,
    ethicsAlerts: true,
    regulatoryAlerts: true,
    visitReminders: true,
    documentAlerts: true,
    securityAlerts: true,
    browserNotifications: false,
  })

  const [system, setSystem] = useState({
    timezone: "Asia/Kolkata",
    dateFormat: "DD MMM YYYY",
    language: "English",
    autoRefresh: true,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: UserRound,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: ShieldCheck,
    },
    {
      id: "system",
      label: "System",
      icon: Database,
    },
  ]

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <SettingsIcon size={22} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Settings
          </h1>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Manage your CTMS profile, notification preferences,
          security and system settings.
        </p>
      </div>

      {/* LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* SIDEBAR */}
        <div className="h-fit rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* CONTENT */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* PROFILE */}
          {activeTab === "profile" && (
            <div>
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="font-semibold text-slate-900">
                  Profile Settings
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your personal and organizational information.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                    MS
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {profile.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {profile.role}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>

                    <input
                      value={profile.name}
                      onChange={(event) =>
                        setProfile({
                          ...profile,
                          name: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={profile.email}
                        onChange={(event) =>
                          setProfile({
                            ...profile,
                            email: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Phone
                    </label>

                    <div className="relative">
                      <Smartphone
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={profile.phone}
                        onChange={(event) =>
                          setProfile({
                            ...profile,
                            phone: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Role
                    </label>

                    <input
                      value={profile.role}
                      disabled
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Organization
                  </label>

                  <input
                    value={profile.organization}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        organization: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div>
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="font-semibold text-slate-900">
                  Notification Preferences
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Choose which CTMS events should generate alerts.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  {
                    key: "emailNotifications",
                    title: "Email Notifications",
                    description:
                      "Receive important CTMS alerts through email.",
                    icon: Mail,
                  },
                  {
                    key: "safetyAlerts",
                    title: "Safety Alerts",
                    description:
                      "Notify me about adverse events and SAE reports.",
                    icon: ShieldCheck,
                  },
                  {
                    key: "ethicsAlerts",
                    title: "Ethics Committee Alerts",
                    description:
                      "Notify me about ethics submissions, approvals and queries.",
                    icon: CheckCircle2,
                  },
                  {
                    key: "regulatoryAlerts",
                    title: "Regulatory Alerts",
                    description:
                      "Notify me about CTRI and regulatory compliance deadlines.",
                    icon: Database,
                  },
                  {
                    key: "visitReminders",
                    title: "Visit Reminders",
                    description:
                      "Receive reminders for upcoming participant visits.",
                    icon: Clock3,
                  },
                  {
                    key: "documentAlerts",
                    title: "Document Alerts",
                    description:
                      "Notify me when documents require review or approval.",
                    icon: Mail,
                  },
                  {
                    key: "securityAlerts",
                    title: "Security Alerts",
                    description:
                      "Receive alerts for failed logins and suspicious activity.",
                    icon: LockKeyhole,
                  },
                  {
                    key: "browserNotifications",
                    title: "Browser Notifications",
                    description:
                      "Allow real-time browser notifications.",
                    icon: Bell,
                  },
                ].map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-4 px-6 py-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-slate-50 p-2 text-indigo-600">
                          <Icon size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            [item.key]:
                              !preferences[item.key],
                          })
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          preferences[item.key]
                            ? "bg-indigo-600"
                            : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            preferences[item.key]
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div>
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="font-semibold text-slate-900">
                  Security Settings
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage authentication and account security.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={22}
                      className="text-emerald-600"
                    />

                    <div>
                      <h3 className="font-semibold text-emerald-900">
                        Account Security Status
                      </h3>

                      <p className="mt-1 text-sm text-emerald-700">
                        Your account is currently protected.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    <LockKeyhole
                      size={21}
                      className="text-indigo-600"
                    />

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Password
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Last changed 30 days ago.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      alert(
                        "Change password flow will be connected to backend."
                      )
                    }
                    className="mt-4 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Change Password
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      size={21}
                      className="text-indigo-600"
                    />

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Two-Factor Authentication
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Add an additional security layer to your account.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      alert(
                        "2FA setup will be connected to backend."
                      )
                    }
                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Configure 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM */}
          {activeTab === "system" && (
            <div>
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="font-semibold text-slate-900">
                  System Preferences
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Configure regional and dashboard preferences.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Timezone
                    </label>

                    <div className="relative">
                      <Globe
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        value={system.timezone}
                        onChange={(event) =>
                          setSystem({
                            ...system,
                            timezone: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="Asia/Kolkata">
                          Asia/Kolkata (IST)
                        </option>

                        <option value="UTC">
                          UTC
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Date Format
                    </label>

                    <select
                      value={system.dateFormat}
                      onChange={(event) =>
                        setSystem({
                          ...system,
                          dateFormat: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    >
                      <option value="DD MMM YYYY">
                        04 Sep 2026
                      </option>

                      <option value="DD/MM/YYYY">
                        04/09/2026
                      </option>

                      <option value="YYYY-MM-DD">
                        2026-09-04
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Language
                    </label>

                    <select
                      value={system.language}
                      onChange={(event) =>
                        setSystem({
                          ...system,
                          language: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    >
                      <option value="English">
                        English
                      </option>

                      <option value="Hindi">
                        Hindi
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Auto Refresh Dashboard
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Automatically refresh real-time CTMS data.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSystem({
                        ...system,
                        autoRefresh: !system.autoRefresh,
                      })
                    }
                    className={`relative h-6 w-11 rounded-full ${
                      system.autoRefresh
                        ? "bg-indigo-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm ${
                        system.autoRefresh
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SAVE */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            {saved ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 size={17} />
                Settings saved successfully
              </div>
            ) : (
              <div />
            )}

            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Save size={17} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white p-2 text-indigo-600">
            <SettingsIcon size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-indigo-900">
              CTMS Configuration
            </h3>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              These settings are currently running in demo mode.
              In the production system, profile, notification,
              security and system preferences will be stored in
              the backend database and applied according to the
              logged-in user's role.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings