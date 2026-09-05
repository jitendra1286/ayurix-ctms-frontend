import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  MapPin,
  Users,
  UserRound,
  Building2,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react"

const sites = [
  {
    id: "SITE-001",
    siteName: "AIIA New Delhi",
    location: "New Delhi, Delhi",
    investigator: "Dr. Meera Sharma",
    designation: "Principal Investigator",
    email: "meera.sharma@aiia.gov.in",
    phone: "+91 98765 43210",
    trials: 3,
    participants: 124,
    target: 200,
    status: "Active",
    startDate: "12 Jan 2026",
  },
  {
    id: "SITE-002",
    siteName: "AIIA Ahmedabad",
    location: "Ahmedabad, Gujarat",
    investigator: "Dr. Rajesh Patel",
    designation: "Principal Investigator",
    email: "rajesh.patel@aiia.gov.in",
    phone: "+91 98765 43111",
    trials: 2,
    participants: 86,
    target: 150,
    status: "Active",
    startDate: "25 Feb 2026",
  },
  {
    id: "SITE-003",
    siteName: "AIIA Jaipur",
    location: "Jaipur, Rajasthan",
    investigator: "Dr. Kavita Singh",
    designation: "Principal Investigator",
    email: "kavita.singh@aiia.gov.in",
    phone: "+91 98765 43222",
    trials: 2,
    participants: 72,
    target: 120,
    status: "Recruiting",
    startDate: "08 Mar 2026",
  },
  {
    id: "SITE-004",
    siteName: "AIIA Bhopal",
    location: "Bhopal, Madhya Pradesh",
    investigator: "Dr. Amit Joshi",
    designation: "Site Investigator",
    email: "amit.joshi@aiia.gov.in",
    phone: "+91 98765 43333",
    trials: 1,
    participants: 58,
    target: 100,
    status: "Active",
    startDate: "18 Apr 2026",
  },
  {
    id: "SITE-005",
    siteName: "AIIA Kochi",
    location: "Kochi, Kerala",
    investigator: "Dr. Anjali Nair",
    designation: "Principal Investigator",
    email: "anjali.nair@aiia.gov.in",
    phone: "+91 98765 43444",
    trials: 2,
    participants: 91,
    target: 140,
    status: "Active",
    startDate: "02 May 2026",
  },
  {
    id: "SITE-006",
    siteName: "AIIA Mumbai",
    location: "Mumbai, Maharashtra",
    investigator: "Dr. Suresh Mehta",
    designation: "Site Investigator",
    email: "suresh.mehta@aiia.gov.in",
    phone: "+91 98765 43555",
    trials: 1,
    participants: 34,
    target: 80,
    status: "Pending",
    startDate: "20 Jun 2026",
  },
  {
    id: "SITE-007",
    siteName: "AIIA Lucknow",
    location: "Lucknow, Uttar Pradesh",
    investigator: "Dr. Priya Verma",
    designation: "Principal Investigator",
    email: "priya.verma@aiia.gov.in",
    phone: "+91 98765 43666",
    trials: 1,
    participants: 45,
    target: 90,
    status: "Inactive",
    startDate: "15 Nov 2025",
  },
]

function StatusBadge({ status }) {
  const config = {
    Active: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    Recruiting: {
      className: "bg-blue-50 text-blue-700",
      icon: Users,
    },
    Pending: {
      className: "bg-amber-50 text-amber-700",
      icon: Clock3,
    },
    Inactive: {
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  }

  const current = config[status] || config.Pending
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

function SitesInvestigators() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        site.id.toLowerCase().includes(searchText) ||
        site.siteName.toLowerCase().includes(searchText) ||
        site.location.toLowerCase().includes(searchText) ||
        site.investigator.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        site.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const totalSites = sites.length

  const activeSites = sites.filter(
    (site) => site.status === "Active"
  ).length

  const recruitingSites = sites.filter(
    (site) => site.status === "Recruiting"
  ).length

  const totalInvestigators = new Set(
    sites.map((site) => site.investigator)
  ).size

  const totalParticipants = sites.reduce(
    (sum, site) => sum + site.participants,
    0
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <div className="flex items-center gap-2">

            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Building2 size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Sites & Investigators
            </h1>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage clinical trial sites, investigators and recruitment
            performance.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <Plus size={18} />
          Add Site
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Sites */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Sites
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalSites}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Building2 size={22} />
            </div>

          </div>

        </div>

        {/* Active Sites */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Active Sites
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {activeSites}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>

          </div>

        </div>

        {/* Investigators */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Investigators
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {totalInvestigators}
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <UserRound size={22} />
            </div>

          </div>

        </div>

        {/* Participants */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Participants Enrolled
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {totalParticipants}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* Recruitment Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

          <div>
            <h2 className="font-semibold text-slate-900">
              Site Recruitment Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Participant enrollment performance by research site.
            </p>
          </div>

          <span className="text-sm font-medium text-blue-600">
            {recruitingSites} sites currently recruiting
          </span>

        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {sites.slice(0, 6).map((site) => {

            const progress = Math.min(
              (site.participants / site.target) * 100,
              100
            )

            return (
              <div
                key={site.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {site.siteName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {site.location}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(progress)}%
                  </span>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

                <div className="mt-2 flex justify-between text-xs text-slate-500">

                  <span>
                    {site.participants} enrolled
                  </span>

                  <span>
                    Target {site.target}
                  </span>

                </div>

              </div>
            )
          })}

        </div>

      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row">

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
              placeholder="Search site, location or investigator..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />

          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Recruiting">Recruiting</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>

      </div>

      {/* Sites Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Research Sites
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredSites.length} site(s) found
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Site
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Principal Investigator
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trials
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Participants
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Recruitment
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

              {filteredSites.map((site) => {

                const progress = Math.min(
                  (site.participants / site.target) * 100,
                  100
                )

                return (
                  <tr
                    key={site.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Site */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Building2 size={19} />
                        </div>

                        <div>

                          <p className="text-xs font-semibold text-blue-600">
                            {site.id}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {site.siteName}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={12} />
                            {site.location}
                          </div>

                        </div>

                      </div>

                    </td>

                    {/* Investigator */}
                    <td className="px-5 py-4">

                      <p className="text-sm font-semibold text-slate-800">
                        {site.investigator}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {site.designation}
                      </p>

                      <p className="mt-1 text-xs text-blue-600">
                        {site.email}
                      </p>

                    </td>

                    {/* Trials */}
                    <td className="px-5 py-4">

                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                        {site.trials}
                      </span>

                    </td>

                    {/* Participants */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Users
                          size={16}
                          className="text-slate-400"
                        />

                        <span className="text-sm font-semibold text-slate-800">
                          {site.participants}
                        </span>

                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        Target {site.target}
                      </p>

                    </td>

                    {/* Recruitment */}
                    <td className="px-5 py-4">

                      <div className="w-32">

                        <div className="mb-1 flex justify-between text-xs">

                          <span className="font-medium text-slate-600">
                            {Math.round(progress)}%
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <StatusBadge
                        status={site.status}
                      />

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-1">

                        <button
                          title="View Site"
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
                )
              })}

            </tbody>

          </table>

        </div>

        {/* Empty State */}
        {filteredSites.length === 0 && (
          <div className="px-6 py-16 text-center">

            <Building2
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No sites found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>

          </div>
        )}

      </div>

      {/* Investigator Info */}
      <div className="flex flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-800 sm:flex-row sm:items-center">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-purple-600">
          <UserRound size={19} />
        </div>

        <div>
          <p className="font-semibold">
            Investigator Management
          </p>

          <p className="mt-1 text-xs text-purple-700">
            Principal Investigators and Site Investigators can be assigned
            to clinical trials and monitored for site-level performance.
          </p>
        </div>

      </div>

    </div>
  )
}

export default SitesInvestigators