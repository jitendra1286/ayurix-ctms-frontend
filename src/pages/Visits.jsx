import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  ScanLine,
  Eye,
  MoreHorizontal,
} from "lucide-react"

const visits = [
  {
    id: "VIS-001",
    participantId: "P-1001",
    participantName: "Ananya Sharma",
    trialId: "TRIAL-001",
    trialName: "Ashwagandha Stress Management Study",
    visitType: "Screening",
    date: "05 Sep 2026",
    time: "09:30 AM",
    site: "AIIA New Delhi",
    investigator: "Dr. Meera Sharma",
    status: "Completed",
    checkIn: "RFID",
  },
  {
    id: "VIS-002",
    participantId: "P-1002",
    participantName: "Rahul Verma",
    trialId: "TRIAL-001",
    trialName: "Ashwagandha Stress Management Study",
    visitType: "Baseline",
    date: "05 Sep 2026",
    time: "10:30 AM",
    site: "AIIA New Delhi",
    investigator: "Dr. Meera Sharma",
    status: "Scheduled",
    checkIn: "Pending",
  },
  {
    id: "VIS-003",
    participantId: "P-1003",
    participantName: "Priya Patel",
    trialId: "TRIAL-002",
    trialName: "Ayurvedic Diabetes Management Trial",
    visitType: "Visit 02",
    date: "06 Sep 2026",
    time: "11:00 AM",
    site: "AIIA Ahmedabad",
    investigator: "Dr. Rajesh Patel",
    status: "Scheduled",
    checkIn: "Pending",
  },
  {
    id: "VIS-004",
    participantId: "P-1004",
    participantName: "Arjun Singh",
    trialId: "TRIAL-003",
    trialName: "Ayurvedic Arthritis Management Study",
    visitType: "Follow-up",
    date: "06 Sep 2026",
    time: "02:00 PM",
    site: "AIIA Jaipur",
    investigator: "Dr. Kavita Singh",
    status: "Scheduled",
    checkIn: "Pending",
  },
  {
    id: "VIS-005",
    participantId: "P-1005",
    participantName: "Neha Joshi",
    trialId: "TRIAL-002",
    trialName: "Ayurvedic Diabetes Management Trial",
    visitType: "Visit 03",
    date: "04 Sep 2026",
    time: "10:00 AM",
    site: "AIIA Bhopal",
    investigator: "Dr. Amit Joshi",
    status: "Missed",
    checkIn: "No Check-in",
  },
  {
    id: "VIS-006",
    participantId: "P-1006",
    participantName: "Vikram Rao",
    trialId: "TRIAL-001",
    trialName: "Ashwagandha Stress Management Study",
    visitType: "Follow-up",
    date: "07 Sep 2026",
    time: "09:00 AM",
    site: "AIIA New Delhi",
    investigator: "Dr. Meera Sharma",
    status: "Scheduled",
    checkIn: "Pending",
  },
  {
    id: "VIS-007",
    participantId: "P-1007",
    participantName: "Kavya Nair",
    trialId: "TRIAL-003",
    trialName: "Ayurvedic Arthritis Management Study",
    visitType: "Baseline",
    date: "03 Sep 2026",
    time: "01:30 PM",
    site: "AIIA Kochi",
    investigator: "Dr. Anjali Nair",
    status: "Completed",
    checkIn: "RFID",
  },
  {
    id: "VIS-008",
    participantId: "P-1008",
    participantName: "Rohit Mehta",
    trialId: "TRIAL-004",
    trialName: "Ayurvedic Immunity Study",
    visitType: "Screening",
    date: "08 Sep 2026",
    time: "03:00 PM",
    site: "AIIA Mumbai",
    investigator: "Dr. Suresh Mehta",
    status: "Scheduled",
    checkIn: "Pending",
  },
]

function StatusBadge({ status }) {
  const config = {
    Scheduled: {
      className: "bg-blue-50 text-blue-700",
      icon: Clock3,
    },
    Completed: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    Missed: {
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  }

  const current = config[status] || config.Scheduled
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

function CheckInBadge({ status }) {
  if (status === "RFID") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <ScanLine size={13} />
        RFID
      </span>
    )
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock3 size={13} />
        Pending
      </span>
    )
  }

  return (
    <span className="text-xs font-medium text-slate-400">
      No Check-in
    </span>
  )
}

function Visits() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")

  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        visit.id.toLowerCase().includes(searchText) ||
        visit.participantId.toLowerCase().includes(searchText) ||
        visit.participantName.toLowerCase().includes(searchText) ||
        visit.trialId.toLowerCase().includes(searchText) ||
        visit.trialName.toLowerCase().includes(searchText) ||
        visit.site.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        visit.status === statusFilter

      const matchesType =
        typeFilter === "All" ||
        visit.visitType === typeFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      )
    })
  }, [search, statusFilter, typeFilter])

  const totalVisits = visits.length

  const scheduledVisits = visits.filter(
    (visit) => visit.status === "Scheduled"
  ).length

  const completedVisits = visits.filter(
    (visit) => visit.status === "Completed"
  ).length

  const missedVisits = visits.filter(
    (visit) => visit.status === "Missed"
  ).length

  const completionRate =
    totalVisits > 0
      ? Math.round((completedVisits / totalVisits) * 100)
      : 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <div className="flex items-center gap-2">

            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <CalendarDays size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Visits
            </h1>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Schedule and monitor participant visits across clinical trials.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <Plus size={18} />
          Schedule Visit
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Visits
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalVisits}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <CalendarDays size={22} />
            </div>

          </div>

        </div>

        {/* Scheduled */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Scheduled
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {scheduledVisits}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Clock3 size={22} />
            </div>

          </div>

        </div>

        {/* Completed */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {completedVisits}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>

          </div>

        </div>

        {/* Missed */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Missed
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {missedVisits}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {completionRate}% completion rate
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <XCircle size={22} />
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
              placeholder="Search visit, participant, trial or site..."
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
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Missed">Missed</option>
          </select>

          {/* Visit Type */}
          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Visit Types</option>
            <option value="Screening">Screening</option>
            <option value="Baseline">Baseline</option>
            <option value="Visit 02">Visit 02</option>
            <option value="Visit 03">Visit 03</option>
            <option value="Follow-up">Follow-up</option>
          </select>

        </div>

      </div>

      {/* Visit Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Visit Schedule
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredVisits.length} visit(s) found
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <ScanLine size={15} />
            RFID check-in enabled
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Visit
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Participant
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Clinical Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date & Time
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Site / Investigator
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Check-in
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

              {filteredVisits.map((visit) => (

                <tr
                  key={visit.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* Visit */}
                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-blue-600">
                      {visit.id}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {visit.visitType}
                    </p>

                  </td>

                  {/* Participant */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                        {visit.participantId.slice(-2)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {visit.participantName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {visit.participantId}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Trial */}
                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-blue-600">
                      {visit.trialId}
                    </p>

                    <p className="mt-1 max-w-xs text-sm font-medium text-slate-800">
                      {visit.trialName}
                    </p>

                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-semibold text-slate-800">
                      {visit.date}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {visit.time}
                    </p>

                  </td>

                  {/* Site */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-slate-800">
                      {visit.site}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {visit.investigator}
                    </p>

                  </td>

                  {/* Check-in */}
                  <td className="px-5 py-4">

                    <CheckInBadge
                      status={visit.checkIn}
                    />

                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <StatusBadge
                      status={visit.status}
                    />

                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1">

                      <button
                        title="View Visit"
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
        {filteredVisits.length === 0 && (
          <div className="px-6 py-16 text-center">

            <CalendarDays
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No visits found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>
        )}

      </div>

      {/* RFID Info */}
      <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 sm:flex-row sm:items-center">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">
          <ScanLine size={19} />
        </div>

        <div>
          <p className="font-semibold">
            Smart RFID Check-in
          </p>

          <p className="mt-1 text-xs text-blue-700">
            Participants with linked RFID cards can be automatically checked
            in when they arrive for a scheduled clinical trial visit.
          </p>
        </div>

      </div>

    </div>
  )
}

export default Visits