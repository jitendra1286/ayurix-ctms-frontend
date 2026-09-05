import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  SlidersHorizontal,
  Eye,
  MoreHorizontal,
  FlaskConical,
} from "lucide-react"

import { trials } from "../data/mockData"

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Recruiting: "bg-blue-50 text-blue-700",
    "Ethics Review": "bg-amber-50 text-amber-700",
    Completed: "bg-slate-100 text-slate-700",
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  )
}

function ClinicalTrials() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [phaseFilter, setPhaseFilter] = useState("All")

  const filteredTrials = useMemo(() => {
    return trials.filter((trial) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        trial.id.toLowerCase().includes(searchText) ||
        trial.title.toLowerCase().includes(searchText) ||
        trial.sponsor.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All" || trial.status === statusFilter

      const matchesPhase =
        phaseFilter === "All" || trial.phase === phaseFilter

      return matchesSearch && matchesStatus && matchesPhase
    })
  }, [search, statusFilter, phaseFilter])

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <FlaskConical size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Clinical Trials
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage and monitor all clinical trials across AIIA research sites.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <Plus size={18} />
          Create New Trial
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Trials
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {trials.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {trials.filter((t) => t.status === "Active").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Recruiting
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {trials.filter((t) => t.status === "Recruiting").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Under Review
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {trials.filter((t) => t.status === "Ethics Review").length}
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trial ID, name or sponsor..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={17} className="text-slate-400" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Recruiting">Recruiting</option>
              <option value="Ethics Review">Ethics Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Phase */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Phases</option>
            <option value="Phase I">Phase I</option>
            <option value="Phase II">Phase II</option>
            <option value="Phase III">Phase III</option>
          </select>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Trial Registry
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredTrials.length} trial(s) found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">

            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phase
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Site
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Enrollment
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Progress
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

              {filteredTrials.map((trial) => {
                const progress = Math.min(
                  (trial.participants / trial.target) * 100,
                  100
                )

                return (
                  <tr
                    key={trial.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-xs font-semibold text-blue-600">
                          {trial.id}
                        </p>

                        <p className="mt-1 max-w-xs font-semibold text-slate-900">
                          {trial.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {trial.sponsor}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {trial.phase}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {trial.site}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {trial.participants}
                        <span className="font-normal text-slate-400">
                          {" "}/ {trial.target}
                        </span>
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="w-32">
                        <div className="mb-1 flex justify-between text-xs text-slate-500">
                          <span>{Math.round(progress)}%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={trial.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          title="View Trial"
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="More"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                          <MoreHorizontal size={17} />
                        </button>
                      </div>
                    </td>

                  </tr>
                )
              })}

            </tbody>
          </table>
        </div>

        {filteredTrials.length === 0 && (
          <div className="px-6 py-16 text-center">
            <FlaskConical
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No trials found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ClinicalTrials