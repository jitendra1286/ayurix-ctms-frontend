import {
  LayoutDashboard,
  FlaskConical,
  Users,
  CalendarDays,
  Building2,
  ShieldCheck,
  FileCheck2,
  HeartPulse,
  ScanLine,
  FolderOpen,
  BarChart3,
  History,
  Bell,
  Settings,
  LogOut,
  Activity,
} from "lucide-react"

import { NavLink } from "react-router-dom"

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Clinical Trials",
    path: "/clinical-trials",
    icon: FlaskConical,
  },
  {
    label: "Participants",
    path: "/participants",
    icon: Users,
  },
  {
    label: "Visits",
    path: "/visits",
    icon: CalendarDays,
  },
  {
    label: "Sites & Investigators",
    path: "/sites-investigators",
    icon: Building2,
  },
  {
    label: "Ethics Committee",
    path: "/ethics",
    icon: ShieldCheck,
  },
  {
    label: "Regulatory / CTRI",
    path: "/regulatory",
    icon: FileCheck2,
  },
  {
    label: "Pharmacovigilance",
    path: "/pharmacovigilance",
    icon: HeartPulse,
  },
  {
    label: "RFID Check-in",
    path: "/rfid-checkin",
    icon: ScanLine,
  },
  {
    label: "Documents",
    path: "/documents",
    icon: FolderOpen,
  },
  {
    label: "Reports & Analytics",
    path: "/reports-analytics",
    icon: BarChart3,
  },
  {
    label: "Audit Trail",
    path: "/audit-trail",
    icon: History,
  },
]

const bottomItems = [
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
]

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Activity size={25} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            AYURIX
          </h1>

          <p className="text-xs text-slate-500">
            Clinical Research
          </p>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>

        {/* System */}
        <p className="mb-3 mt-7 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          System
        </p>

        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
            JR
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              Research Admin
            </p>

            <p className="truncate text-xs text-slate-500">
              Administrator
            </p>
          </div>

          <LogOut
            size={17}
            className="cursor-pointer text-slate-400 hover:text-red-500"
          />

        </div>
      </div>

    </aside>
  )
}

export default Sidebar