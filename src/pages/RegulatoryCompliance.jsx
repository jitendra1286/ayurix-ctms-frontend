import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle,
  ExternalLink,
  CalendarDays,
  FileText,
  ClipboardCheck,
  MoreHorizontal,
  Eye,
} from "lucide-react"

const regulatoryRecords = [
  {
    id: "REG-001",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    regulatoryBody: "CTRI",
    registrationNo: "CTRI/2026/04/045678",
    submissionDate: "10 Apr 2026",
    approvalDate: "18 Apr 2026",
    expiryDate: "18 Apr 2028",
    status: "Registered",
    compliance: 100,
    reviewer: "Regulatory Team",
    documents: 8,
    priority: "High",
  },
  {
    id: "REG-002",
    trialId: "TRIAL-002",
    trialTitle: "Ayurvedic Therapy for Chronic Arthritis",
    regulatoryBody: "CDSCO / NDCT",
    registrationNo: "CT-2026-00214",
    submissionDate: "22 May 2026",
    approvalDate: "05 Jun 2026",
    expiryDate: "05 Jun 2028",
    status: "Approved",
    compliance: 100,
    reviewer: "Regulatory Team",
    documents: 10,
    priority: "High",
  },
  {
    id: "REG-003",
    trialId: "TRIAL-003",
    trialTitle: "Herbal Support in Migraine Management",
    regulatoryBody: "CTRI",
    registrationNo: "-",
    submissionDate: "20 Aug 2026",
    approvalDate: "-",
    expiryDate: "-",
    status: "Pending Submission",
    compliance: 65,
    reviewer: "Dr. Kavita Singh",
    documents: 6,
    priority: "High",
  },
  {
    id: "REG-004",
    trialId: "TRIAL-004",
    trialTitle: "Ayurvedic Formulation for Skin Disorders",
    regulatoryBody: "CDSCO / NDCT",
    registrationNo: "CT-2026-00492",
    submissionDate: "12 Aug 2026",
    approvalDate: "-",
    expiryDate: "-",
    status: "Under Review",
    compliance: 82,
    reviewer: "Regulatory Team",
    documents: 7,
    priority: "Medium",
  },
  {
    id: "REG-005",
    trialId: "TRIAL-005",
    trialTitle: "Ayurvedic Lifestyle Intervention Study",
    regulatoryBody: "CTRI",
    registrationNo: "CTRI/2026/05/056781",
    submissionDate: "04 May 2026",
    approvalDate: "12 May 2026",
    expiryDate: "12 May 2028",
    status: "Registered",
    compliance: 96,
    reviewer: "Regulatory Team",
    documents: 9,
    priority: "Medium",
  },
  {
    id: "REG-006",
    trialId: "TRIAL-006",
    trialTitle: "Ayurvedic Treatment for Sleep Disorders",
    regulatoryBody: "CDSCO / NDCT",
    registrationNo: "-",
    submissionDate: "30 Aug 2026",
    approvalDate: "-",
    expiryDate: "-",
    status: "Action Required",
    compliance: 48,
    reviewer: "Not Assigned",
    documents: 4,
    priority: "High",
  },
  {
    id: "REG-007",
    trialId: "TRIAL-007",
    trialTitle: "Herbal Intervention for Digestive Health",
    regulatoryBody: "CTRI",
    registrationNo: "CTRI/2026/06/062314",
    submissionDate: "15 Jun 2026",
    approvalDate: "25 Jun 2026",
    expiryDate: "25 Jun 2028",
    status: "Registered",
    compliance: 91,
    reviewer: "Regulatory Team",
    documents: 8,
    priority: "Low",
  },
]

const complianceItems = [
  {
    title: "CTRI Registration",
    description: "Clinical trial registration status",
    status: "Completed",
  },
  {
    title: "Ethics Committee Approval",
    description: "IEC approval linked with trial",
    status: "Completed",
  },
  {
    title: "Protocol Documentation",
    description: "Approved protocol and amendments",
    status: "Completed",
  },
  {
    title: "Informed Consent",
    description: "Participant consent documentation",
    status: "Completed",
  },
  {
    title: "Regulatory Documents",
    description: "Required regulatory submissions",
    status: "Pending",
  },
  {
    title: "Safety Reporting",
    description: "Adverse event and SAE tracking",
    status: "Pending",
  },
]

function StatusBadge({ status }) {
  const config = {
    Registered: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    Approved: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    "Pending Submission": {
      className: "bg-amber-50 text-amber-700",
      icon: Clock3,
    },
    "Under Review": {
      className: "bg-blue-50 text-blue-700",
      icon: ClipboardCheck,
    },
    "Action Required": {
      className: "bg-red-50 text-red-700",
      icon: AlertTriangle,
    },
  }

  const current = config[status] || config["Pending Submission"]
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

function PriorityBadge({ priority }) {
  const config = {
    High: "bg-red-50 text-red-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-slate-100 text-slate-600",
  }

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        config[priority] || config.Low
      }`}
    >
      {priority}
    </span>
  )
}

function RegulatoryCompliance() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredRecords = useMemo(() => {
    return regulatoryRecords.filter((record) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        record.id.toLowerCase().includes(searchText) ||
        record.trialId.toLowerCase().includes(searchText) ||
        record.trialTitle.toLowerCase().includes(searchText) ||
        record.regulatoryBody.toLowerCase().includes(searchText) ||
        record.registrationNo.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const totalRecords = regulatoryRecords.length

  const registered = regulatoryRecords.filter(
    (record) =>
      record.status === "Registered" ||
      record.status === "Approved"
  ).length

  const underReview = regulatoryRecords.filter(
    (record) => record.status === "Under Review"
  ).length

  const pending = regulatoryRecords.filter(
    (record) => record.status === "Pending Submission"
  ).length

  const actionRequired = regulatoryRecords.filter(
    (record) => record.status === "Action Required"
  ).length

  const averageCompliance = Math.round(
    regulatoryRecords.reduce(
      (sum, record) => sum + record.compliance,
      0
    ) / regulatoryRecords.length
  )

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <div className="flex items-center gap-2">

            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <ShieldCheck size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Regulatory Compliance
            </h1>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Track CTRI registration, regulatory submissions and
            NDCT compliance for clinical trials.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
          <Plus size={18} />
          New Regulatory Record
        </button>

      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Records
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalRecords}
              </p>
            </div>

            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <FileText size={22} />
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Registered / Approved
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {registered}
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
                Under Review
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {underReview}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <ClipboardCheck size={22} />
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Pending Submission
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pending}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <Clock3 size={22} />
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Action Required
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {actionRequired}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <AlertTriangle size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* COMPLIANCE SCORE */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <h2 className="font-semibold text-slate-900">
              Regulatory Compliance Score
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Overall compliance status across active clinical trials.
            </p>

          </div>

          <div className="text-right">

            <p className="text-3xl font-bold text-indigo-600">
              {averageCompliance}%
            </p>

            <p className="text-xs text-slate-500">
              Overall compliance
            </p>

          </div>

        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{
              width: `${averageCompliance}%`,
            }}
          />

        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-500">

          <span>
            Compliance tracking active
          </span>

          <span>
            Target: 100%
          </span>

        </div>

      </div>

      {/* REGULATORY CHECKLIST */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div>

          <h2 className="font-semibold text-slate-900">
            Regulatory Compliance Checklist
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Monitor important compliance areas for each clinical trial.
          </p>

        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

          {complianceItems.map((item) => {

            const completed = item.status === "Completed"

            return (
              <div
                key={item.title}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >

                <div className="flex items-start gap-3">

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      completed
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Clock3 size={18} />
                    )}
                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>

                      <span
                        className={`text-[11px] font-semibold ${
                          completed
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </div>

      {/* SEARCH */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search trial, registration number or regulatory body..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
          >

            <option value="All">
              All Status
            </option>

            <option value="Registered">
              Registered
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Pending Submission">
              Pending Submission
            </option>

            <option value="Under Review">
              Under Review
            </option>

            <option value="Action Required">
              Action Required
            </option>

          </select>

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>

            <h2 className="font-semibold text-slate-900">
              Regulatory Records
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredRecords.length} record(s) found
            </p>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1400px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Record
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Clinical Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Regulatory Body
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Registration No.
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Submission
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Compliance
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Priority
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

              {filteredRecords.map((record) => (

                <tr
                  key={record.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* RECORD */}
                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-indigo-600">
                      {record.id}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {record.submissionDate}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {record.documents} documents
                    </p>

                  </td>

                  {/* TRIAL */}
                  <td className="max-w-[280px] px-5 py-4">

                    <p className="text-xs font-semibold text-blue-600">
                      {record.trialId}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {record.trialTitle}
                    </p>

                  </td>

                  {/* BODY */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <ShieldCheck size={16} />
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {record.regulatoryBody}
                      </span>

                    </div>

                  </td>

                  {/* REGISTRATION */}
                  <td className="px-5 py-4">

                    {record.registrationNo !== "-" ? (
                      <div className="flex items-center gap-2">

                        <span className="text-sm font-medium text-slate-700">
                          {record.registrationNo}
                        </span>

                        <ExternalLink
                          size={14}
                          className="text-indigo-500"
                        />

                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">
                        Not available
                      </span>
                    )}

                  </td>

                  {/* SUBMISSION */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={15}
                        className="text-slate-400"
                      />

                      <div>

                        <p className="text-sm text-slate-700">
                          {record.submissionDate}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Approval: {record.approvalDate}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* COMPLIANCE */}
                  <td className="px-5 py-4">

                    <div className="w-32">

                      <div className="mb-1 flex justify-between text-xs">

                        <span className="font-semibold text-slate-700">
                          {record.compliance}%
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className={`h-full rounded-full transition-all ${
                            record.compliance >= 90
                              ? "bg-emerald-500"
                              : record.compliance >= 70
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                          style={{
                            width: `${record.compliance}%`,
                          }}
                        />

                      </div>

                    </div>

                  </td>

                  {/* PRIORITY */}
                  <td className="px-5 py-4">

                    <PriorityBadge
                      priority={record.priority}
                    />

                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">

                    <StatusBadge
                      status={record.status}
                    />

                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1">

                      <button
                        title="View Regulatory Record"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="More Actions"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                      >
                        <MoreHorizontal size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {filteredRecords.length === 0 && (

          <div className="px-6 py-16 text-center">

            <ShieldCheck
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No regulatory records found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>

          </div>

        )}

      </div>

      {/* NDCT INFORMATION */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
            <FileCheck2 size={20} />
          </div>

          <div>

            <h3 className="font-semibold text-indigo-900">
              NDCT Rules 2019 Compliance
            </h3>

            <p className="mt-1 text-sm text-indigo-700">
              The system maintains regulatory documentation,
              submission status, approval records and compliance
              checkpoints for clinical trials.
            </p>

          </div>

        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">

          <div className="rounded-lg bg-white p-4">

            <p className="text-xs font-medium text-slate-500">
              CTRI
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              Registration Tracking
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Track registration number, submission and status.
            </p>

          </div>

          <div className="rounded-lg bg-white p-4">

            <p className="text-xs font-medium text-slate-500">
              NDCT 2019
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              Regulatory Checklist
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Maintain required regulatory documents and workflow.
            </p>

          </div>

          <div className="rounded-lg bg-white p-4">

            <p className="text-xs font-medium text-slate-500">
              Audit Readiness
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              Document & Status History
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Keep submission and approval activities traceable.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default RegulatoryCompliance