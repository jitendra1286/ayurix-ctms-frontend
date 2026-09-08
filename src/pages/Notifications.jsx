import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ShieldAlert,
  CalendarDays,
  FileText,
  ClipboardCheck,
  Activity,
  FlaskConical,
  BarChart3,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

const typeConfig = {
  Ethics: {
    icon: ClipboardCheck,
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  Safety: {
    icon: Activity,
    bg: "bg-red-100",
    text: "text-red-600",
  },
  Visit: {
    icon: CalendarDays,
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  Document: {
    icon: FileText,
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
  Regulatory: {
    icon: ShieldAlert,
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  Trial: {
    icon: FlaskConical,
    bg: "bg-green-100",
    text: "text-green-600",
  },
  Security: {
    icon: ShieldAlert,
    bg: "bg-red-100",
    text: "text-red-600",
  },
  Report: {
    icon: BarChart3,
    bg: "bg-indigo-100",
    text: "text-indigo-600",
  },
};

const priorityConfig = {
  Critical: {
    bg: "bg-red-100",
    text: "text-red-700",
  },
  High: {
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
  Medium: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  Low: {
    bg: "bg-gray-100",
    text: "text-gray-700",
  },
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD NOTIFICATIONS
     ========================================================= */
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      if (response.data.success) {
        setNotifications(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);

      if (err.response?.status === 401) {
        setError("Authorization token is required. Please login again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load notifications."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* =========================================================
     MARK SINGLE AS READ
     ========================================================= */
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  /* =========================================================
     MARK ALL AS READ
     ========================================================= */
  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  /* =========================================================
     DELETE NOTIFICATION
     ========================================================= */
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  /* =========================================================
     FILTER
     ========================================================= */
  const filteredNotifications = useMemo(() => {
    if (filter === "Unread") {
      return notifications.filter(
        (notification) => !notification.isRead
      );
    }

    if (filter === "Critical") {
      return notifications.filter(
        (notification) => notification.priority === "Critical"
      );
    }

    return notifications;
  }, [notifications, filter]);

  /* =========================================================
     STATS
     ========================================================= */
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const criticalCount = notifications.filter(
    (notification) => notification.priority === "Critical"
  ).length;

  const getTypeConfig = (type) => {
    return (
      typeConfig[type] || {
        icon: Bell,
        bg: "bg-gray-100",
        text: "text-gray-600",
      }
    );
  };

  const getPriorityConfig = (priority) => {
    return (
      priorityConfig[priority] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with important CTMS activities and alerts.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadNotifications}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={17} />
            Mark All Read
          </button>
        </div>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Notifications
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {notifications.length}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-100 p-3">
              <Bell className="text-blue-600" size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Unread
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {unreadCount}
              </h2>
            </div>

            <div className="rounded-lg bg-orange-100 p-3">
              <Bell className="text-orange-600" size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Critical Alerts
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {criticalCount}
              </h2>
            </div>

            <div className="rounded-lg bg-red-100 p-3">
              <AlertTriangle
                className="text-red-600"
                size={22}
              />
            </div>
          </div>
        </div>

      </div>

      {/* =====================================================
          CRITICAL ALERT
      ===================================================== */}
      {criticalCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle
            className="mt-0.5 shrink-0 text-red-600"
            size={20}
          />

          <div>
            <h3 className="font-semibold text-red-800">
              Critical Alerts Require Attention
            </h3>

            <p className="mt-1 text-sm text-red-700">
              There are {criticalCount} critical notification
              {criticalCount > 1 ? "s" : ""} that may require
              immediate action.
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          FILTERS
      ===================================================== */}
      <div className="flex flex-wrap gap-2">
        {["All", "Unread", "Critical"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === item
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {item}

            {item === "Unread" && unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {unreadCount}
              </span>
            )}

            {item === "Critical" && criticalCount > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {criticalCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <RefreshCw
            className="mx-auto animate-spin text-blue-600"
            size={28}
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading notifications...
          </p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        /* ===================================================
           EMPTY STATE
           =================================================== */
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Bell
            className="mx-auto text-gray-300"
            size={42}
          />

          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            No notifications found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            You're all caught up.
          </p>
        </div>
      ) : (
        /* ===================================================
           NOTIFICATION LIST
           =================================================== */
        <div className="space-y-3">

          {filteredNotifications.map((notification) => {
            const type = getTypeConfig(notification.type);
            const priority = getPriorityConfig(
              notification.priority
            );

            const TypeIcon = type.icon;

            return (
              <div
                key={notification.id}
                className={`rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                  notification.isRead
                    ? "border-gray-200"
                    : "border-blue-200 bg-blue-50/30"
                }`}
              >
                <div className="flex gap-4">

                  {/* ICON */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${type.bg}`}
                  >
                    <TypeIcon
                      size={21}
                      className={type.text}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">

                      <div>
                        <div className="flex flex-wrap items-center gap-2">

                          <h3
                            className={`font-semibold ${
                              notification.isRead
                                ? "text-gray-800"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${priority.bg} ${priority.text}`}
                      >
                        {notification.priority}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{notification.type}</span>

                        <span>•</span>

                        <span>
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">

                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markAsRead(notification.id)
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Check size={14} />
                            Mark Read
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteNotification(notification.id)
                          }
                          className="rounded-lg border border-red-200 bg-white p-2 text-red-600 hover:bg-red-50"
                          title="Delete notification"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* =====================================================
          INFO
      ===================================================== */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex gap-3">
          <Bell
            className="mt-0.5 shrink-0 text-gray-500"
            size={18}
          />

          <p className="text-sm text-gray-600">
            Notifications are linked with the CTMS backend and
            are filtered according to the logged-in user.
            Important ethics, safety, regulatory, visit and
            security alerts can be tracked here.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Notifications;