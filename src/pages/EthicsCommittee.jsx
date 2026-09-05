import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  MessageSquareWarning,
  FileText,
  CalendarDays,
  UserRound,
  Eye,
  MoreHorizontal,
  ClipboardCheck,
} from "lucide-react"

const ethicsSubmissions = [
  {
    id: "ETH-001",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    investigator: "Dr. Meera Sharma",
    committee: "AIIA Institutional Ethics Committee",
    submissionDate: "05 Aug 2026",
    meetingDate: "12 Sep 2026",
    reviewer: "Dr. Anil Kapoor",
    status: "Approved",
    documents: 8,
    priority: "High",
    decisionDate: "20 Aug 2026",
    remarks: "Protocol and informed consent documents approved.",
  },
  {
    id: "ETH-002",
    trialId: "TRIAL-002",
    trialTitle: "Ayurvedic Therapy for Chronic Arthritis",
    investigator: "Dr. Rajesh Patel",
    committee: "AIIA Institutional Ethics Committee",
    submissionDate: "18 Aug 2026",
    meetingDate: "10 Sep 2026",
    reviewer: "Dr. Sunita Rao",
    status: "Under Review",
    documents: 6,
    priority: "Medium",
    decisionDate: "-",
    remarks: "Protocol is currently under committee review.",
  },
  {
    id: "ETH-003",
    trialId: "TRIAL-003",
    trialTitle: "Herbal Support in Migraine Management",
    investigator: "Dr. Kavita Singh",
    committee: "AIIA Institutional Ethics Committee",
    submissionDate: "22 Aug 2026",
    meetingDate: "15 Sep 2026",
    reviewer: "Dr. Anil Kapoor",
    status: "Pending Review",
    documents: 7,
    priority: "High",
    decisionDate: "-",
    remarks: "Submission received and waiting for reviewer assignment.",
  },
  {
    id: "ETH-004",
    trialId: "TRIAL-004",
    trialTitle: "Ayurvedic Formulation for Skin Disorders",
    investigator: "Dr. Amit Joshi",
    committee: "AIIA Institutional Ethics Committee",
    submissionDate: "25 Aug 2026",
    meetingDate: "18 Sep 2026",
    reviewer: "Dr. Sunita Rao",
    status: "Query Raised",
    documents: 5,
    priority: "High",
    decisionDate: "-",
    remarks: "Additional participant consent clarification requested.",
  },
  {
    id: "ETH-005",
    trialId: "TRIAL-005",
    trialTitle: "Ayurvedic Lifestyle Intervention Study",
    investigator: "Dr. Anjali Nair",
    committee: "AIIA Institutional Ethics Committee",
    submissionDate: "28 Aug 2026",
    meetingDate: "20 Sep 2026",
    reviewer: "Dr. Priya Verma",
    status: "Approved",
    documents: 9,
    priority: "Medium",
    decisionDate: "01 Sep 2026",
    remarks: "Ethics approval granted with no major observations.",
  },
  {
    id: "ETH-006",
    trialId: "TRIAL-006",
    trialTitle: "Ayurvedic Treatment for Sleep Disorders",
    investigator: "Dr. Suresh Mehta",
    committee: "AIIA Institutional Ethics Committee",
    submissionDate: "30 Aug 2026",
    meetingDate: "22 Sep 2026",
    reviewer: "Not Assigned",
    status: "Pending Review",
    documents: 4,
    priority: "Low",
    decisionDate: "-",
    remarks: "Awaiting initial ethics committee screening.",
  },
  {
    id: "ETH-007",
    trialId: "TRIAL-007",
    trialTitle: "Herbal Intervention for Digestive Health",
    investigator: "Dr. Priya Verma",
    committee: "AIIA Institutional Ethics Committee",
    submissionDate: "02 Sep 2026",
    meetingDate: "25 Sep 2026",
    reviewer: "Dr. Anil Kapoor",
    status: "Rejected",
    documents: 6,
    priority: "High",
    decisionDate: "03 Sep 2026",
    remarks: "Major protocol modifications required before resubmission.",
  },
]

function StatusBadge({ status }) {
  const config = {
    "Pending Review": {
      className: "bg-amber-50 text-amber-700",
      icon: Clock3,
    },
    "Under Review": {
      className: "bg-blue-50 text-blue-700",
      icon: ClipboardCheck,
    },
    "Query Raised": {
      className: "bg-orange-50 text-orange-700",
      icon: MessageSquareWarning,
    },
    Approved: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    Rejected: {
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  }

  const current = config[status] || config["Pending Review"]
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

function EthicsCommittee() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredSubmissions = useMemo(() => {
    return ethicsSubmissions.filter((submission) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        submission.id.toLowerCase().includes(searchText) ||
        submission.trialId.toLowerCase().includes(searchText) ||
        submission.trialTitle.toLowerCase().includes(searchText) ||
        submission.investigator.toLowerCase().includes(searchText) ||
        submission.committee.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        submission.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const totalSubmissions = ethicsSubmissions.length

  const pendingReviews = ethicsSubmissions.filter(
    (item) => item.status === "Pending Review"
  ).length

  const underReview = ethicsSubmissions.filter(
    (item) => item.status === "Under Review"
  ).length

  const approved = ethicsSubmissions.filter(
    (item) => item.status === "Approved"
  ).length

  const queries = ethicsSubmissions.filter(
    (item) => item.status === "Query Raised"
  ).length

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <ShieldCheck size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Ethics Committee
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage ethics submissions, reviews, queries and approval
            decisions for clinical trials.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700">
          <Plus size={18} />
          New Submission
        </button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Submissions
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalSubmissions}
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <FileText size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Pending Review
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingReviews}
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
                Approved
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {approved}
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
                Queries Raised
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                {queries}
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <MessageSquareWarning size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* WORKFLOW */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div>
          <h2 className="font-semibold text-slate-900">
            Ethics Review Workflow
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Track every submission from initial screening to final
            committee decision.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {[
            {
              label: "Pending Review",
              count: pendingReviews,
              icon: Clock3,
            },
            {
              label: "Under Review",
              count: underReview,
              icon: ClipboardCheck,
            },
            {
              label: "Query Raised",
              count: queries,
              icon: MessageSquareWarning,
            },
            {
              label: "Approved",
              count: approved,
              icon: CheckCircle2,
            },
          ].map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.label}
                className="flex flex-1 items-center"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {step.label}
                    </p>

                    <p className="text-xs text-slate-500">
                      {step.count} submission(s)
                    </p>
                  </div>

                </div>

                {index < 3 && (
                  <div className="mx-4 hidden h-px flex-1 bg-slate-200 md:block" />
                )}
              </div>
            )
          })}

        </div>
      </div>

      {/* SEARCH + FILTER */}
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
              placeholder="Search submission, trial or investigator..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-white"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-purple-500"
          >
            <option value="All">All Status</option>
            <option value="Pending Review">
              Pending Review
            </option>
            <option value="Under Review">
              Under Review
            </option>
            <option value="Query Raised">
              Query Raised
            </option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Ethics Submissions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredSubmissions.length} submission(s) found
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Submission
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Clinical Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Investigator
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reviewer
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Meeting
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Documents
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

              {filteredSubmissions.map((submission) => (

                <tr
                  key={submission.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* SUBMISSION */}
                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-purple-600">
                      {submission.id}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      Submitted {submission.submissionDate}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {submission.committee}
                    </p>

                  </td>

                  {/* TRIAL */}
                  <td className="max-w-[280px] px-5 py-4">

                    <p className="text-xs font-semibold text-blue-600">
                      {submission.trialId}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {submission.trialTitle}
                    </p>

                  </td>

                  {/* INVESTIGATOR */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                        <UserRound size={15} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {submission.investigator}
                        </p>

                        <p className="text-xs text-slate-500">
                          Principal Investigator
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* REVIEWER */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-slate-700">
                      {submission.reviewer}
                    </p>

                  </td>

                  {/* MEETING */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-sm text-slate-700">

                      <CalendarDays
                        size={15}
                        className="text-slate-400"
                      />

                      {submission.meetingDate}

                    </div>

                  </td>

                  {/* DOCUMENTS */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <FileText
                        size={16}
                        className="text-slate-400"
                      />

                      <span className="text-sm font-semibold text-slate-700">
                        {submission.documents}
                      </span>

                    </div>

                  </td>

                  {/* PRIORITY */}
                  <td className="px-5 py-4">
                    <PriorityBadge
                      priority={submission.priority}
                    />
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <StatusBadge status={submission.status} />
                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1">

                      <button
                        title="View Submission"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-purple-50 hover:text-purple-600"
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

        {filteredSubmissions.length === 0 && (

          <div className="px-6 py-16 text-center">

            <ShieldCheck
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No submissions found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>

          </div>

        )}

      </div>

      {/* APPROVAL TIMELINE */}
      <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-purple-600">
            <ShieldCheck size={20} />
          </div>

          <div>

            <h3 className="font-semibold text-purple-900">
              Ethics & Participant Protection
            </h3>

            <p className="mt-1 text-sm text-purple-700">
              Ethics review ensures that trial protocols,
              participant information sheets and informed consent
              documents are reviewed before participant enrollment.
            </p>

          </div>

        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">

          <div className="rounded-lg bg-white p-4">

            <p className="text-xs font-medium text-slate-500">
              Protocol
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              Submitted
            </p>

          </div>

          <div className="rounded-lg bg-white p-4">

            <p className="text-xs font-medium text-slate-500">
              Documents
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              Committee Review
            </p>

          </div>

          <div className="rounded-lg bg-white p-4">

            <p className="text-xs font-medium text-slate-500">
              Decision
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              Approved / Query / Rejected
            </p>

          </div>

          <div className="rounded-lg bg-white p-4">

            <p className="text-xs font-medium text-slate-500">
              Enrollment
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              After Required Approvals
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default EthicsCommittee