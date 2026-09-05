import { useMemo, useState } from "react"
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
} from "lucide-react"

const auditLogs = [
  {
    id: "AUD-00091",
    timestamp: "04 Sep 2026, 10:24 AM",
    user: "Dr. Meera Sharma",
    role: "Researcher",
    action: "Updated Participant",
    module: "Participants",
    recordId: "P-1024",
    description: "Participant visit information was updated.",
    ipAddress: "192.168.1.24",
    status: "Success",
  },
  {
    id: "AUD-00090",
    timestamp: "04 Sep 2026, 10:12 AM",
    user: "Admin User",
    role: "Administrator",
    action: "Approved Trial",
    module: "Clinical Trials",
    recordId: "TRIAL-001",
    description: "Clinical trial status changed to approved.",
    ipAddress: "192.168.1.10",
    status: "Success",
  },
  {
    id: "AUD-00089",
    timestamp: "04 Sep 2026, 09:58 AM",
    user: "Dr. Rajesh Patel",
    role: "Investigator",
    action: "Reported Adverse Event",
    module: "Pharmacovigilance",
    recordId: "AE-00125",
    description: "New adverse event record was created.",
    ipAddress: "192.168.2.18",
    status: "Success",
  },
  {
    id: "AUD-00088",
    timestamp: "04 Sep 2026, 09:42 AM",
    user: "RFID Device",
    role: "System",
    action: "Participant Check-in",
    module: "RFID Check-in",
    recordId: "P-1024",
    description: "Participant checked in using RFID device.",
    ipAddress: "10.0.0.21",
    status: "Success",
  },
  {
    id: "AUD-00087",
    timestamp: "04 Sep 2026, 09:31 AM",
    user: "Dr. Kavita Singh",
    role: "Investigator",
    action: "Uploaded Document",
    module: "Documents",
    recordId: "DOC-00121",
    description: "Investigator CV was uploaded.",
    ipAddress: "192.168.3.12",
    status: "Success",
  },
  {
    id: "AUD-00086",
    timestamp: "04 Sep 2026, 09:18 AM",
    user: "Admin User",
    role: "Administrator",
    action: "Changed Status",
    module: "Ethics Committee",
    recordId: "EC-0042",
    description: "Ethics submission moved to Under Review.",
    ipAddress: "192.168.1.10",
    status: "Success",
  },
  {
    id: "AUD-00085",
    timestamp: "04 Sep 2026, 08:57 AM",
    user: "Regulatory Team",
    role: "Regulatory",
    action: "Updated Compliance",
    module: "Regulatory",
    recordId: "REG-0019",
    description: "CTRI compliance record was updated.",
    ipAddress: "192.168.4.16",
    status: "Success",
  },
  {
    id: "AUD-00084",
    timestamp: "04 Sep 2026, 08:41 AM",
    user: "RFID Device",
    role: "System",
    action: "Blocked Check-in",
    module: "RFID Check-in",
    recordId: "INVALID001",
    description: "Unknown RFID UID attempted participant check-in.",
    ipAddress: "10.0.0.21",
    status: "Warning",
  },
  {
    id: "AUD-00083",
    timestamp: "03 Sep 2026, 06:32 PM",
    user: "Dr. Amit Joshi",
    role: "Investigator",
    action: "Updated Visit",
    module: "Visits",
    recordId: "VIS-0092",
    description: "Participant visit status was updated.",
    ipAddress: "192.168.5.19",
    status: "Success",
  },
  {
    id: "AUD-00082",
    timestamp: "03 Sep 2026, 05:48 PM",
    user: "Admin User",
    role: "Administrator",
    action: "Deleted Document",
    module: "Documents",
    recordId: "DOC-00115",
    description: "Document was removed from the active document repository.",
    ipAddress: "192.168.1.10",
    status: "Warning",
  },
  {
    id: "AUD-00081",
    timestamp: "03 Sep 2026, 04:26 PM",
    user: "System",
    role: "System",
    action: "Login Failed",
    module: "Authentication",
    recordId: "AUTH-0081",
    description: "Failed authentication attempt detected.",
    ipAddress: "172.16.2.45",
    status: "Failed",
  },
]

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
      {role}
    </span>
  )
}

function AuditTrail() {
  const [search, setSearch] = useState("")
  const [moduleFilter, setModuleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [roleFilter, setRoleFilter] = useState("All")
  const [selectedLog, setSelectedLog] = useState(null)

  const filteredLogs = useMemo(() => {
    const value = search.toLowerCase()

    return auditLogs.filter((log) => {
      const matchesSearch =
        log.id.toLowerCase().includes(value) ||
        log.user.toLowerCase().includes(value) ||
        log.action.toLowerCase().includes(value) ||
        log.module.toLowerCase().includes(value) ||
        log.recordId.toLowerCase().includes(value) ||
        log.description.toLowerCase().includes(value) ||
        log.ipAddress.toLowerCase().includes(value)

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
    search,
    moduleFilter,
    statusFilter,
    roleFilter,
  ])

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

  const handleExport = () => {
    alert("Audit trail exported successfully in demo mode.")
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

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
        >
          <Download size={17} />
          Export Audit Log
        </button>
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
              system information. This provides traceability for
              clinical trial operations and review workflows.
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
              <option value="Participants">
                Participants
              </option>
              <option value="Clinical Trials">
                Clinical Trials
              </option>
              <option value="Pharmacovigilance">
                Pharmacovigilance
              </option>
              <option value="RFID Check-in">
                RFID Check-in
              </option>
              <option value="Documents">
                Documents
              </option>
              <option value="Ethics Committee">
                Ethics Committee
              </option>
              <option value="Regulatory">
                Regulatory
              </option>
              <option value="Visits">Visits</option>
              <option value="Authentication">
                Authentication
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
                  key={log.id}
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
              important CTMS operations. In the production backend,
              audit entries should be generated automatically by
              the API and protected from unauthorized modification
              or deletion.
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