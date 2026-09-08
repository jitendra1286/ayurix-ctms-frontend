import { useEffect, useMemo, useState } from "react"
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
  Trash2,
  X,
} from "lucide-react"

import api from "../services/api"

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
  const [submissions, setSubmissions] = useState([])
  const [trials, setTrials] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const [form, setForm] = useState({
    trial_id: "",
    investigator_name: "",
    committee_name: "AIIA Institutional Ethics Committee",
    submission_date: "",
    meeting_date: "",
    reviewer_name: "",
    status: "PENDING_REVIEW",
    documents_count: 0,
    priority: "MEDIUM",
    decision_date: "",
    remarks: "",
  })

  // =========================
  // FETCH DATA
  // =========================

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/ethics")

      setSubmissions(response.data.submissions || [])
    } catch (err) {
      console.error("Fetch Ethics Error:", err)

      setError(
        err.response?.data?.message ||
          "Failed to load ethics submissions"
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchTrials = async () => {
    try {
      const response = await api.get("/trials")

      setTrials(response.data.trials || [])
    } catch (err) {
      console.error("Fetch Trials Error:", err)
    }
  }

  useEffect(() => {
    fetchSubmissions()
    fetchTrials()
  }, [])

  // =========================
  // FILTER
  // =========================

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        submission.id?.toLowerCase().includes(searchText) ||
        submission.trialId?.toLowerCase().includes(searchText) ||
        submission.trialTitle?.toLowerCase().includes(searchText) ||
        submission.investigator?.toLowerCase().includes(searchText) ||
        submission.committee?.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        submission.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [submissions, search, statusFilter])

  // =========================
  // STATS
  // =========================

  const totalSubmissions = submissions.length

  const pendingReviews = submissions.filter(
    (item) => item.status === "Pending Review"
  ).length

  const underReview = submissions.filter(
    (item) => item.status === "Under Review"
  ).length

  const approved = submissions.filter(
    (item) => item.status === "Approved"
  ).length

  const queries = submissions.filter(
    (item) => item.status === "Query Raised"
  ).length

  // =========================
  // FORM
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setForm({
      trial_id: "",
      investigator_name: "",
      committee_name: "AIIA Institutional Ethics Committee",
      submission_date: "",
      meeting_date: "",
      reviewer_name: "",
      status: "PENDING_REVIEW",
      documents_count: 0,
      priority: "MEDIUM",
      decision_date: "",
      remarks: "",
    })
  }

  const openNewSubmission = () => {
    resetForm()
    setShowModal(true)
  }

  // =========================
  // CREATE SUBMISSION
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.post("/ethics", {
        ...form,
        trial_id: Number(form.trial_id),
        documents_count: Number(form.documents_count || 0),
      })

      alert("Ethics submission created successfully")

      setShowModal(false)
      resetForm()

      await fetchSubmissions()
    } catch (err) {
      console.error("Create Ethics Error:", err)

      alert(
        err.response?.data?.message ||
          "Failed to create ethics submission"
      )
    }
  }

  // =========================
  // VIEW
  // =========================

  const handleView = async (submission) => {
    try {
      const numericId = submissions.find(
        (item) => item.id === submission.id
      )?.id

      const originalSubmission = submissions.find(
        (item) => item.id === submission.id
      )

      if (!originalSubmission) return

      const response = await api.get(
        `/ethics/${originalSubmission.databaseId || originalSubmission.id}`
      )

      setSelectedSubmission({
        ...submission,
        ...response.data.submission,
      })

      setShowViewModal(true)
    } catch (err) {
      console.error("View Ethics Error:", err)

      // Fallback to already loaded data
      setSelectedSubmission(submission)
      setShowViewModal(true)
    }
  }

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (submission) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${submission.id}?`
    )

    if (!confirmed) return

    try {
      const originalId = submissions.find(
        (item) => item.id === submission.id
      )?.databaseId

      if (!originalId) {
        alert("Unable to identify submission")
        return
      }

      await api.delete(`/ethics/${originalId}`)

      alert("Ethics submission deleted successfully")

      await fetchSubmissions()
    } catch (err) {
      console.error("Delete Ethics Error:", err)

      alert(
        err.response?.data?.message ||
          "Failed to delete ethics submission"
      )
    }
  }

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

        <button
          onClick={openNewSubmission}
          className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
        >
          <Plus size={18} />
          New Submission
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={FileText}
          color="purple"
        />

        <StatCard
          title="Pending Review"
          value={pendingReviews}
          icon={Clock3}
          color="amber"
        />

        <StatCard
          title="Under Review"
          value={underReview}
          icon={ClipboardCheck}
          color="blue"
        />

        <StatCard
          title="Approved"
          value={approved}
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Queries Raised"
          value={queries}
          icon={MessageSquareWarning}
          color="orange"
        />

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
              {loading
                ? "Loading submissions..."
                : `${filteredSubmissions.length} submission(s) found`}
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

              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading ethics submissions...
                  </td>
                </tr>
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (

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
                          onClick={() => handleView(submission)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-purple-50 hover:text-purple-600"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Delete Submission"
                          onClick={() => handleDelete(submission)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
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

                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-16 text-center"
                  >

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

                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* INFORMATION */}
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

          <InfoBox
            title="Protocol"
            value="Submitted"
          />

          <InfoBox
            title="Documents"
            value="Committee Review"
          />

          <InfoBox
            title="Decision"
            value="Approved / Query / Rejected"
          />

          <InfoBox
            title="Enrollment"
            value="After Required Approvals"
          />

        </div>

      </div>

      {/* ========================= */}
      {/* NEW SUBMISSION MODAL */}
      {/* ========================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  New Ethics Submission
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Submit a clinical trial for ethics committee review.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* TRIAL */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Clinical Trial *
                </label>

                <select
                  name="trial_id"
                  value={form.trial_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-500"
                >
                  <option value="">
                    Select Clinical Trial
                  </option>

                  {trials.map((trial) => (
                    <option
                      key={trial.id}
                      value={trial.id}
                    >
                      TRIAL-{String(trial.id).padStart(3, "0")} -{" "}
                      {trial.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* TWO COLUMNS */}
              <div className="grid gap-4 md:grid-cols-2">

                <FormInput
                  label="Investigator Name"
                  name="investigator_name"
                  value={form.investigator_name}
                  onChange={handleChange}
                  placeholder="Dr. Investigator Name"
                />

                <FormInput
                  label="Reviewer Name"
                  name="reviewer_name"
                  value={form.reviewer_name}
                  onChange={handleChange}
                  placeholder="Reviewer name"
                />

                <FormInput
                  label="Submission Date"
                  name="submission_date"
                  type="date"
                  value={form.submission_date}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Meeting Date"
                  name="meeting_date"
                  type="date"
                  value={form.meeting_date}
                  onChange={handleChange}
                />

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-500"
                  >
                    <option value="PENDING_REVIEW">
                      Pending Review
                    </option>

                    <option value="UNDER_REVIEW">
                      Under Review
                    </option>

                    <option value="QUERY_RAISED">
                      Query Raised
                    </option>

                    <option value="APPROVED">
                      Approved
                    </option>

                    <option value="REJECTED">
                      Rejected
                    </option>
                  </select>
                </div>

                <FormInput
                  label="Documents Count"
                  name="documents_count"
                  type="number"
                  min="0"
                  value={form.documents_count}
                  onChange={handleChange}
                />

                <FormInput
                  label="Decision Date"
                  name="decision_date"
                  type="date"
                  value={form.decision_date}
                  onChange={handleChange}
                />

              </div>

              {/* COMMITTEE */}
              <FormInput
                label="Committee Name"
                name="committee_name"
                value={form.committee_name}
                onChange={handleChange}
              />

              {/* REMARKS */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Add ethics committee remarks..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-500"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Submit for Review
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* VIEW MODAL */}
      {/* ========================= */}

      {showViewModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>
                <p className="text-xs font-semibold text-purple-600">
                  {selectedSubmission.submission_code ||
                    selectedSubmission.id}
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Ethics Submission Details
                </h2>
              </div>

              <button
                onClick={() => setShowViewModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">

                <div>
                  <p className="text-xs text-slate-500">
                    Status
                  </p>

                  <div className="mt-1">
                    <StatusBadge
                      status={
                        selectedSubmission.status?.includes("_")
                          ? formatStatus(
                              selectedSubmission.status
                            )
                          : selectedSubmission.status
                      }
                    />
                  </div>
                </div>

                <PriorityBadge
                  priority={
                    selectedSubmission.priority?.includes("_")
                      ? selectedSubmission.priority
                          .charAt(0)
                          .toUpperCase() +
                        selectedSubmission.priority
                          .slice(1)
                          .toLowerCase()
                      : selectedSubmission.priority
                  }
                />

              </div>

              <DetailRow
                label="Clinical Trial"
                value={
                  selectedSubmission.trial_title ||
                  selectedSubmission.trialTitle
                }
              />

              <DetailRow
                label="Trial ID"
                value={
                  selectedSubmission.trialId ||
                  selectedSubmission.trial_id
                }
              />

              <DetailRow
                label="Investigator"
                value={
                  selectedSubmission.investigator ||
                  selectedSubmission.investigator_name
                }
              />

              <DetailRow
                label="Committee"
                value={
                  selectedSubmission.committee ||
                  selectedSubmission.committee_name
                }
              />

              <DetailRow
                label="Reviewer"
                value={
                  selectedSubmission.reviewer ||
                  selectedSubmission.reviewer_name ||
                  "Not Assigned"
                }
              />

              <DetailRow
                label="Submission Date"
                value={
                  selectedSubmission.submissionDate ||
                  selectedSubmission.submission_date
                }
              />

              <DetailRow
                label="Meeting Date"
                value={
                  selectedSubmission.meetingDate ||
                  selectedSubmission.meeting_date ||
                  "-"
                }
              />

              <DetailRow
                label="Documents"
                value={
                  selectedSubmission.documents ||
                  selectedSubmission.documents_count ||
                  0
                }
              />

              <DetailRow
                label="Decision Date"
                value={
                  selectedSubmission.decisionDate ||
                  selectedSubmission.decision_date ||
                  "-"
                }
              />

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Remarks
                </p>

                <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  {selectedSubmission.remarks ||
                    "No remarks available."}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

// =========================
// SMALL COMPONENTS
// =========================

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  const colors = {
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  }

  const textColors = {
    purple: "text-slate-900",
    amber: "text-amber-600",
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    orange: "text-orange-600",
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${textColors[color]}`}
          >
            {value}
          </p>

        </div>

        <div
          className={`rounded-lg p-3 ${colors[color]}`}
        >
          <Icon size={22} />
        </div>

      </div>

    </div>
  )
}

function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && " *"}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-500"
      />

    </div>
  )
}

function InfoBox({ title, value }) {
  return (
    <div className="rounded-lg bg-white p-4">

      <p className="text-xs font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-slate-100 pb-3">

      <p className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value || "-"}
      </p>

    </div>
  )
}

function formatStatus(status) {
  const statusMap = {
    PENDING_REVIEW: "Pending Review",
    UNDER_REVIEW: "Under Review",
    QUERY_RAISED: "Query Raised",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  }

  return statusMap[status] || status
}

export default EthicsCommittee