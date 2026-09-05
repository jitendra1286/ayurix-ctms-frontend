import { useMemo, useState } from "react"
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  CalendarDays,
  FileText,
  ClipboardCheck,
  Clock3,
  Check,
  CheckCheck,
  Filter,
  Trash2,
} from "lucide-react"

const initialNotifications = [
  {
    id: 1,
    title: "New Ethics Submission",
    message:
      "TRIAL-004 has been submitted to the Ethics Committee for review.",
    type: "Ethics",
    time: "10 minutes ago",
    date: "04 Sep 2026, 10:20 AM",
    read: false,
    priority: "High",
  },
  {
    id: 2,
    title: "Serious Adverse Event Reported",
    message:
      "A new SAE has been reported for participant P-1031 in TRIAL-002.",
    type: "Safety",
    time: "32 minutes ago",
    date: "04 Sep 2026, 09:58 AM",
    read: false,
    priority: "Critical",
  },
  {
    id: 3,
    title: "Upcoming Participant Visit",
    message:
      "Participant P-1024 has a scheduled Visit 03 today at AIIA New Delhi.",
    type: "Visit",
    time: "1 hour ago",
    date: "04 Sep 2026, 09:30 AM",
    read: false,
    priority: "Medium",
  },
  {
    id: 4,
    title: "Document Pending Review",
    message:
      "Investigator CV DOC-00121 is waiting for review.",
    type: "Document",
    time: "2 hours ago",
    date: "04 Sep 2026, 08:30 AM",
    read: true,
    priority: "Medium",
  },
  {
    id: 5,
    title: "CTRI Compliance Reminder",
    message:
      "TRIAL-003 requires an upcoming CTRI compliance review.",
    type: "Regulatory",
    time: "3 hours ago",
    date: "04 Sep 2026, 07:30 AM",
    read: false,
    priority: "High",
  },
  {
    id: 6,
    title: "Trial Enrollment Target Reached",
    message:
      "TRIAL-005 has reached its target enrollment of 75 participants.",
    type: "Trial",
    time: "Yesterday",
    date: "03 Sep 2026, 06:20 PM",
    read: true,
    priority: "Low",
  },
  {
    id: 7,
    title: "RFID Check-in Blocked",
    message:
      "Unknown RFID UID INVALID001 attempted participant check-in.",
    type: "Security",
    time: "Yesterday",
    date: "03 Sep 2026, 05:45 PM",
    read: false,
    priority: "Critical",
  },
  {
    id: 8,
    title: "Report Generated",
    message:
      "Monthly clinical trial analytics report was generated successfully.",
    type: "Report",
    time: "Yesterday",
    date: "03 Sep 2026, 04:15 PM",
    read: true,
    priority: "Low",
  },
]

function TypeIcon({ type }) {
  const config = {
    Ethics: {
      icon: ClipboardCheck,
      className: "bg-purple-50 text-purple-600",
    },
    Safety: {
      icon: ShieldAlert,
      className: "bg-red-50 text-red-600",
    },
    Visit: {
      icon: CalendarDays,
      className: "bg-blue-50 text-blue-600",
    },
    Document: {
      icon: FileText,
      className: "bg-amber-50 text-amber-600",
    },
    Regulatory: {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-600",
    },
    Trial: {
      icon: CheckCircle2,
      className: "bg-indigo-50 text-indigo-600",
    },
    Security: {
      icon: ShieldAlert,
      className: "bg-red-50 text-red-600",
    },
    Report: {
      icon: FileText,
      className: "bg-slate-100 text-slate-600",
    },
  }

  const current = config[type] || config.Report
  const Icon = current.icon

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${current.className}`}
    >
      <Icon size={21} />
    </div>
  )
}

function PriorityBadge({ priority }) {
  const config = {
    Critical: "bg-red-50 text-red-700",
    High: "bg-orange-50 text-orange-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-slate-100 text-slate-600",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        config[priority] || config.Low
      }`}
    >
      {priority}
    </span>
  )
}

function Notifications() {
  const [notifications, setNotifications] =
    useState(initialNotifications)

  const [filter, setFilter] = useState("All")

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  const criticalCount = notifications.filter(
    (notification) =>
      notification.priority === "Critical"
  ).length

  const filteredNotifications = useMemo(() => {
    if (filter === "Unread") {
      return notifications.filter(
        (notification) => !notification.read
      )
    }

    if (filter === "Critical") {
      return notifications.filter(
        (notification) =>
          notification.priority === "Critical"
      )
    }

    return notifications
  }, [notifications, filter])

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter(
        (notification) => notification.id !== id
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Bell size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Monitor important clinical trial alerts, safety
            events, visits, documents and regulatory activities.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <CheckCheck size={17} />
          Mark All as Read
        </button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Notifications
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Unread
          </p>

          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {unreadCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Critical Alerts
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {criticalCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            System Status
          </p>

          <p className="mt-2 flex items-center gap-2 text-lg font-bold text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Operational
          </p>
        </div>
      </div>

      {/* ALERT BANNER */}
      {criticalCount > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white p-2 text-red-600">
              <AlertTriangle size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-red-900">
                Critical Alerts Require Attention
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-700">
                There are {criticalCount} critical notification(s)
                related to participant safety or system security.
                Please review them immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FILTER */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">
              Notification Center
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Review and manage your CTMS notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter
              size={17}
              className="text-slate-400"
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">
                All Notifications
              </option>

              <option value="Unread">
                Unread
              </option>

              <option value="Critical">
                Critical
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-xl border bg-white p-5 shadow-sm transition ${
              notification.read
                ? "border-slate-200"
                : "border-indigo-200 bg-indigo-50/20"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <TypeIcon type={notification.type} />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-semibold ${
                        notification.read
                          ? "text-slate-800"
                          : "text-slate-900"
                      }`}
                    >
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    )}

                    <PriorityBadge
                      priority={notification.priority}
                    />
                  </div>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {notification.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {notification.time}
                    </span>

                    <span>
                      {notification.date}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                      {notification.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    title="Mark as read"
                    className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Check size={18} />
                  </button>
                )}

                <button
                  onClick={() =>
                    deleteNotification(notification.id)
                  }
                  title="Delete notification"
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <Bell
              size={42}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              No notifications found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              You are all caught up.
            </p>
          </div>
        )}
      </div>

      {/* NOTIFICATION NOTE */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
            <Bell size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-indigo-900">
              Smart CTMS Notifications
            </h3>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              In the production system, notifications can be
              generated automatically for SAE reports, ethics
              approvals, regulatory deadlines, pending documents,
              upcoming visits and security events.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications