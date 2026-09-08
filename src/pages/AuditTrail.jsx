import { useEffect, useMemo, useState } from "react"
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Download,
  Clock3,
  UserRound,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  ChevronDown,
  RefreshCw,
} from "lucide-react"

import api from "../services/api"

function StatusBadge({ status }) {
  const config = {
    Success: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    Warning: {
      className: "bg-amber-50 text-amber-700",
      icon: AlertTriangle,
    },
    Failed: {
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  }

  const current = config[status] || config.Success
  const Icon = current.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  )
}

function RoleBadge({ role }) {
  const colors = {
    Administrator: "bg-purple-50 text-purple-700",
    Researcher: "bg-blue-50 text-blue-700",
    Investigator: "bg-indigo-50 text-indigo-700",
    Regulatory: "bg-emerald-50 text-emerald-700",
    System: "bg-slate-100 text-slate-600",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        colors[role] || "bg-slate-100 text-slate-600"
      }`}
    >
      {role || "System"}
    </span>
  )
}

function formatTimestamp(value) {
  if (!value) return "-"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatAction(action) {
  if (!action) return "-"

  return action
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatModule(entityType) {
  if (!entityType) return "System"

  const modules = {
    TRIAL: "Clinical Trials",
    PARTICIPANT: "Participants",
    VISIT: "Visits",
    ADVERSE_EVENT: "Pharmacovigilance",
    DOCUMENT: "Documents",
    ETHICS: "Ethics Committee",
    REGULATORY: "Regulatory",
    RFID: "RFID Check-in",
    AUTH: "Authentication",
    SITE: "Sites & Investigators",
  }

  if (modules[entityType]) {
    return modules[entityType]
  }

  return entityType
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatStatus(action) {
  const value = String(action || "").toUpperCase()

  if (
    value.includes("FAIL") ||
    value.includes("BLOCK") ||
    value.includes("ERROR")
  ) {
    return value.includes("BLOCK") ? "Warning" : "Failed"
  }

  return "Success"
}

function AuditTrail() {
  const [auditLogs, setAuditLogs] = useState([])

  const [search, setSearch] = useState("")
  const [moduleFilter, setModuleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [roleFilter, setRoleFilter] = useState("All")

  const [selectedLog, setSelectedLog] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  /*
  |--------------------------------------------------------------------------
  | LOAD AUDIT LOGS
  |--------------------------------------------------------------------------
  */

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/audit-logs")

      const logs = response.data?.data || []

      const formattedLogs = logs.map((item) => {
        const action = formatAction(item.action)

        return {
          id:
            item.auditCode ||
            item.id ||
            `AUD-${String(item.databaseId || "").padStart(5, "0")}`,

          databaseId: item.databaseId || item.id,

          timestamp: formatTimestamp(
            item.createdAt ||
              item.created_at ||
              item.timestamp
          ),

          user:
            item.userName ||
            item.user_name ||
            item.username ||
            "System",

          role:
            item.role ||
            item.userRole ||
            item.user_role ||
            "System",

          action,

          module:
            item.module ||
            formatModule(item.entityType || item.entity_type),

          recordId:
            item.recordId ||
            item.record_id ||
            item.entityId ||
            item.entity_id ||
            "-",

          description:
            item.details ||
            item.description ||
            "Audit activity recorded in the CTMS.",

          ipAddress:
            item.ipAddress ||
            item.ip_address ||
            "-",

          status:
            item.status ||
            formatStatus(item.action),
        }
      })

      setAuditLogs(formattedLogs)
    } catch (err) {
      console.error("Audit logs API error:", err)

      if (err.response?.status === 401) {
        setError(
          "Authorization token is required. Please login again."
        )
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load audit logs."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuditLogs()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredLogs = useMemo(() => {
    const value = search.toLowerCase().trim()

    return auditLogs.filter((log) => {
      const matchesSearch =
        !value ||
        String(log.id).toLowerCase().includes(value) ||
        String(log.user).toLowerCase().includes(value) ||
        String(log.action).toLowerCase().includes(value) ||
        String(log.module).toLowerCase().includes(value) ||
        String(log.recordId).toLowerCase().includes(value) ||
        String(log.description).toLowerCase().includes(value) ||
        String(log.ipAddress).toLowerCase().includes(value)

      const matchesModule =
        moduleFilter === "All" ||
        log.module === moduleFilter

      const matchesStatus =
        statusFilter === "All" ||
        log.status === statusFilter

      const matchesRole =
        roleFilter === "All" ||
        log.role === roleFilter

      return (
        matchesSearch &&
        matchesModule &&
        matchesStatus &&
        matchesRole
      )
    })
  }, [
    auditLogs,
    search,
    moduleFilter,
    statusFilter,
    roleFilter,
  ])

  /*
  |--------------------------------------------------------------------------
  | STATS
  |--------------------------------------------------------------------------
  */

  const totalLogs = auditLogs.length

  const successfulLogs = auditLogs.filter(
    (log) => log.status === "Success"
  ).length

  const warningLogs = auditLogs.filter(
    (log) => log.status === "Warning"
  ).length

  const failedLogs = auditLogs.filter(
    (log) => log.status === "Failed"
  ).length

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    if (!auditLogs.length) {
      alert("No audit logs available to export.")
      return
    }

    const exportData = auditLogs.map((log) => ({
      auditId: log.id,
      timestamp: log.timestamp,
      user: log.user,
      role: log.role,
      action: log.action,
      module: log.module,
      recordId: log.recordId,
      description: log.description,
      ipAddress: log.ipAddress,
      status: log.status,
    }))

    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      {
        type: "application/json",
      }
    )

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement("a")

    link.href = url
    link.download = "ayurix-audit-trail.json"

    document.body.appendChild(link)

    link.click()

    link.remove()

    window.URL.revokeObjectURL(url)
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-slate-700"
          />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Loading audit trail...
          </p>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={22}
            className="mt-0.5 text-red-600"
          />

          <div>
            <h2 className="font-semibold text-red-800">
              Unable to load Audit Trail
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={loadAuditLogs}
              className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <div className="flex items-center gap-2">

            <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
              <ShieldCheck size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Audit Trail
            </h1>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Track user activities, system actions, data changes
            and security events across the CTMS.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={loadAuditLogs}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
          >
            <Download size={17} />
            Export Audit Log
          </button>

        </div>
      </div>

      {/* SECURITY STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Activities
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalLogs}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Activity size={22} />
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Successful
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {successfulLogs}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Warnings
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {warningLogs}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <AlertTriangle size={22} />
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Failed / Security
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {failedLogs}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <XCircle size={22} />
            </div>

          </div>
        </div>

      </div>

      {/* AUDIT PRINCIPLE */}

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
            <Database size={20} />
          </div>

          <div>

            <h3 className="font-semibold text-indigo-900">
              Traceable Activity History
            </h3>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              Every important action can be recorded with user,
              timestamp, module, affected record, action type and
              system information.
            </p>

          </div>

        </div>

      </div>

      {/* FILTERS */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-3 lg:grid-cols-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search audit logs..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-500 focus:bg-white"
            />

          </div>

          <div className="relative">

            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={moduleFilter}
              onChange={(event) =>
                setModuleFilter(event.target.value)
              }
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm text-slate-700 outline-none focus:border-slate-500"
            >
              <option value="All">All Modules</option>
              <option value="Participants">Participants</option>
              <option value="Clinical Trials">
                Clinical Trials
              </option>
              <option value="Pharmacovigilance">
                Pharmacovigilance
              </option>
              <option value="RFID Check-in">
                RFID Check-in
              </option>
              <option value="Documents">Documents</option>
              <option value="Ethics Committee">
                Ethics Committee
              </option>
              <option value="Regulatory">Regulatory</option>
              <option value="Visits">Visits</option>
              <option value="Authentication">
                Authentication
              </option>
              <option value="Sites & Investigators">
                Sites & Investigators
              </option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            <option value="All">All Roles</option>
            <option value="Administrator">
              Administrator
            </option>
            <option value="Researcher">Researcher</option>
            <option value="Investigator">
              Investigator
            </option>
            <option value="Regulatory">Regulatory</option>
            <option value="System">System</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            <option value="All">All Status</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Failed">Failed</option>
          </select>

        </div>
      </div>

      {/* AUDIT TABLE */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Activity Log
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredLogs.length} audit record(s) found
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <Clock3 size={14} />
            Real-time activity tracking
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1450px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Audit ID
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Timestamp
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Module
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Record
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  IP Address
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredLogs.map((log) => (

                <tr
                  key={log.databaseId || log.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-slate-700">
                      {log.id}
                    </span>
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <Clock3
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="text-sm text-slate-700">
                        {log.timestamp}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserRound size={14} />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {log.user}
                        </p>

                        <div className="mt-1">
                          <RoleBadge role={log.role} />
                        </div>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <FileText
                        size={15}
                        className="text-indigo-500"
                      />

                      <span className="text-sm font-semibold text-slate-800">
                        {log.action}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {log.module}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <span className="text-sm font-semibold text-indigo-600">
                      {log.recordId}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <span className="font-mono text-xs text-slate-500">
                      {log.ipAddress}
                    </span>

                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={log.status} />
                  </td>

                  <td className="px-5 py-4">

                    <button
                      onClick={() => setSelectedLog(log)}
                      title="View Audit Details"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Eye size={17} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {filteredLogs.length === 0 && (

          <div className="px-6 py-16 text-center">

            <ShieldCheck
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No audit records found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>

      {/* SECURITY NOTE */}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700">
            <ShieldCheck size={20} />
          </div>

          <div>

            <h3 className="font-semibold text-slate-900">
              Audit & Data Integrity
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Audit records provide a traceable history of
              important CTMS operations and system activities.
            </p>

          </div>

        </div>

      </div>

      {/* DETAIL MODAL */}

      {selectedLog && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>

                <h2 className="font-semibold text-slate-900">
                  Audit Log Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedLog.id}
                </p>

              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <XCircle size={20} />
              </button>

            </div>

            <div className="space-y-4 p-6">

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Action
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedLog.action}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {selectedLog.description}
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-slate-500">
                    User
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedLog.user}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Role
                  </p>

                  <div className="mt-1">
                    <RoleBadge role={selectedLog.role} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Module
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedLog.module}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Record ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-indigo-600">
                    {selectedLog.recordId}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Timestamp
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedLog.timestamp}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    IP Address
                  </p>

                  <p className="mt-1 font-mono text-sm text-slate-700">
                    {selectedLog.ipAddress}
                  </p>
                </div>

              </div>

              <div>

                <p className="text-xs text-slate-500">
                  Status
                </p>

                <div className="mt-1">
                  <StatusBadge status={selectedLog.status} />
                </div>

              </div>

            </div>

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">

              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default AuditTrail