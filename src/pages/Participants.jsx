import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  Users,
  Eye,
  MoreHorizontal,
  UserCheck,
  UserX,
  Clock3,
  ScanLine,
} from "lucide-react"

import { participants } from "../data/mockData"

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Completed: "bg-slate-100 text-slate-700",
    Screening: "bg-amber-50 text-amber-700",
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

function RfidBadge({ status }) {
  if (status === "Linked") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        <ScanLine size={13} />
        RFID Linked
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
      <ScanLine size={13} />
      Not Linked
    </span>
  )
}

function Participants() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [genderFilter, setGenderFilter] = useState("All")

  const participantsWithRfid = participants.map((participant, index) => ({
    ...participant,
    rfidStatus: index === 0 || index === 1 || index === 4 ? "Linked" : "Not Linked",
  }))

  const filteredParticipants = useMemo(() => {
    return participantsWithRfid.filter((participant) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        participant.id.toLowerCase().includes(searchText) ||
        participant.name.toLowerCase().includes(searchText) ||
        participant.trial.toLowerCase().includes(searchText) ||
        participant.trialName.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        participant.status === statusFilter

      const matchesGender =
        genderFilter === "All" ||
        participant.gender === genderFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGender
      )
    })
  }, [search, statusFilter, genderFilter])

  const activeCount = participants.filter(
    (participant) => participant.status === "Active"
  ).length

  const screeningCount = participants.filter(
    (participant) => participant.status === "Screening"
  ).length

  const completedCount = participants.filter(
    (participant) => participant.status === "Completed"
  ).length

  const linkedRfidCount = participantsWithRfid.filter(
    (participant) => participant.rfidStatus === "Linked"
  ).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Users size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Participants
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage enrolled participants, screening status and trial visits.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <Plus size={18} />
          Add Participant
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Participants
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {participants.length}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Active
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {activeCount}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        {/* Screening */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Screening
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {screeningCount}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        {/* RFID */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                RFID Linked
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {linkedRfidCount}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <ScanLine size={22} />
            </div>
          </div>
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search participant ID, name or trial..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Screening">Screening</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Gender */}
          <select
            value={genderFilter}
            onChange={(event) =>
              setGenderFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

        </div>
      </div>

      {/* Participant Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Participant Registry
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredParticipants.length} participant(s) found
            </p>
          </div>

          <button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:flex">
            Export
          </button>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Participant
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Demographics
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Clinical Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Next Visit
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  RFID
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

              {filteredParticipants.map((participant) => (

                <tr
                  key={participant.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* Participant */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-700">
                        {participant.id.slice(-2)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {participant.name}
                        </p>

                        <p className="mt-1 text-xs font-medium text-blue-600">
                          {participant.id}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Demographics */}
                  <td className="px-5 py-4">

                    <p className="text-sm text-slate-700">
                      {participant.age} years
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {participant.gender}
                    </p>

                  </td>

                  {/* Trial */}
                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-blue-600">
                      {participant.trial}
                    </p>

                    <p className="mt-1 max-w-xs text-sm font-medium text-slate-800">
                      {participant.trialName}
                    </p>

                  </td>

                  {/* Next Visit */}
                  <td className="px-5 py-4">

                    {participant.nextVisit === "-" ? (
                      <span className="text-sm text-slate-400">
                        No upcoming visit
                      </span>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {participant.nextVisit}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Scheduled
                        </p>
                      </div>
                    )}

                  </td>

                  {/* RFID */}
                  <td className="px-5 py-4">
                    <RfidBadge
                      status={participant.rfidStatus}
                    />
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge
                      status={participant.status}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1">

                      <button
                        title="View Participant"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
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

        {/* Empty State */}
        {filteredParticipants.length === 0 && (
          <div className="px-6 py-16 text-center">

            <UserX
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No participants found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 sm:flex-row sm:items-center">
        <ScanLine size={18} />

        <p>
          RFID-enabled participants can use the Smart Check-in system
          for scheduled clinical trial visits.
        </p>
      </div>

    </div>
  )
}

export default Participants