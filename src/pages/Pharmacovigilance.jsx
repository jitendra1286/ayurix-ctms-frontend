import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  ShieldAlert,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  XCircle,
  FileText,
  UserRound,
  CalendarDays,
  Eye,
  MoreHorizontal,
  HeartPulse,
  Siren,
} from "lucide-react"

const adverseEvents = [
  {
    id: "AE-00125",
    participant: "P-1024",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    site: "AIIA New Delhi",
    event: "Nausea",
    severity: "Mild",
    seriousness: "Non-Serious",
    causality: "Possible",
    action: "Observation",
    outcome: "Recovering",
    status: "Under Review",
    reportedBy: "Dr. Meera Sharma",
    reportedDate: "02 Sep 2026",
    onsetDate: "02 Sep 2026",
  },
  {
    id: "AE-00124",
    participant: "P-1031",
    trialId: "TRIAL-002",
    trialTitle: "Ayurvedic Therapy for Chronic Arthritis",
    site: "AIIA Ahmedabad",
    event: "Headache",
    severity: "Moderate",
    seriousness: "Non-Serious",
    causality: "Unlikely",
    action: "Supportive Treatment",
    outcome: "Recovered",
    status: "Closed",
    reportedBy: "Dr. Rajesh Patel",
    reportedDate: "01 Sep 2026",
    onsetDate: "31 Aug 2026",
  },
  {
    id: "AE-00123",
    participant: "P-1045",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    site: "AIIA New Delhi",
    event: "Skin Rash",
    severity: "Severe",
    seriousness: "Serious",
    causality: "Probable",
    action: "Intervention Discontinued",
    outcome: "Recovering",
    status: "SAE Review",
    reportedBy: "Dr. Meera Sharma",
    reportedDate: "30 Aug 2026",
    onsetDate: "29 Aug 2026",
  },
  {
    id: "AE-00122",
    participant: "P-1078",
    trialId: "TRIAL-003",
    trialTitle: "Herbal Support in Migraine Management",
    site: "AIIA Jaipur",
    event: "Dizziness",
    severity: "Moderate",
    seriousness: "Non-Serious",
    causality: "Possible",
    action: "Dose Modified",
    outcome: "Recovering",
    status: "Under Review",
    reportedBy: "Dr. Kavita Singh",
    reportedDate: "29 Aug 2026",
    onsetDate: "28 Aug 2026",
  },
  {
    id: "AE-00121",
    participant: "P-1089",
    trialId: "TRIAL-004",
    trialTitle: "Ayurvedic Formulation for Skin Disorders",
    site: "AIIA Bhopal",
    event: "Vomiting",
    severity: "Severe",
    seriousness: "Serious",
    causality: "Possible",
    action: "Hospitalization",
    outcome: "Recovered",
    status: "Reported",
    reportedBy: "Dr. Amit Joshi",
    reportedDate: "27 Aug 2026",
    onsetDate: "27 Aug 2026",
  },
  {
    id: "AE-00120",
    participant: "P-1093",
    trialId: "TRIAL-005",
    trialTitle: "Ayurvedic Lifestyle Intervention Study",
    site: "AIIA Kochi",
    event: "Fatigue",
    severity: "Mild",
    seriousness: "Non-Serious",
    causality: "Unlikely",
    action: "No Action",
    outcome: "Recovered",
    status: "Closed",
    reportedBy: "Dr. Anjali Nair",
    reportedDate: "25 Aug 2026",
    onsetDate: "24 Aug 2026",
  },
  {
    id: "AE-00119",
    participant: "P-1102",
    trialId: "TRIAL-006",
    trialTitle: "Ayurvedic Treatment for Sleep Disorders",
    site: "AIIA Mumbai",
    event: "Abdominal Pain",
    severity: "Moderate",
    seriousness: "Non-Serious",
    causality: "Possible",
    action: "Observation",
    outcome: "Not Recovered",
    status: "Under Review",
    reportedBy: "Dr. Suresh Mehta",
    reportedDate: "23 Aug 2026",
    onsetDate: "23 Aug 2026",
  },
]

function SeverityBadge({ severity }) {
  const config = {
    Mild: "bg-emerald-50 text-emerald-700",
    Moderate: "bg-amber-50 text-amber-700",
    Severe: "bg-red-50 text-red-700",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        config[severity] || "bg-slate-100 text-slate-600"
      }`}
    >
      {severity}
    </span>
  )
}

function SeriousnessBadge({ seriousness }) {
  const isSerious = seriousness === "Serious"

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isSerious
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {isSerious && <Siren size={13} />}
      {seriousness}
    </span>
  )
}

function StatusBadge({ status }) {
  const config = {
    "Under Review": {
      className: "bg-blue-50 text-blue-700",
      icon: Clock3,
    },
    "SAE Review": {
      className: "bg-red-50 text-red-700",
      icon: Siren,
    },
    Reported: {
      className: "bg-purple-50 text-purple-700",
      icon: FileText,
    },
    Closed: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
  }

  const current = config[status] || config["Under Review"]
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

function Pharmacovigilance() {
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [seriousnessFilter, setSeriousnessFilter] = useState("All")

  const filteredEvents = useMemo(() => {
    return adverseEvents.filter((event) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        event.id.toLowerCase().includes(searchText) ||
        event.participant.toLowerCase().includes(searchText) ||
        event.trialId.toLowerCase().includes(searchText) ||
        event.trialTitle.toLowerCase().includes(searchText) ||
        event.event.toLowerCase().includes(searchText) ||
        event.site.toLowerCase().includes(searchText) ||
        event.reportedBy.toLowerCase().includes(searchText)

      const matchesSeverity =
        severityFilter === "All" ||
        event.severity === severityFilter

      const matchesStatus =
        statusFilter === "All" ||
        event.status === statusFilter

      const matchesSeriousness =
        seriousnessFilter === "All" ||
        event.seriousness === seriousnessFilter

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus &&
        matchesSeriousness
      )
    })
  }, [
    search,
    severityFilter,
    statusFilter,
    seriousnessFilter,
  ])

  const totalEvents = adverseEvents.length

  const seriousEvents = adverseEvents.filter(
    (event) => event.seriousness === "Serious"
  ).length

  const underReview = adverseEvents.filter(
    (event) => event.status === "Under Review"
  ).length

  const resolvedEvents = adverseEvents.filter(
    (event) =>
      event.status === "Closed" ||
      event.outcome === "Recovered"
  ).length

  const severeEvents = adverseEvents.filter(
    (event) => event.severity === "Severe"
  ).length

  const mildEvents = adverseEvents.filter(
    (event) => event.severity === "Mild"
  ).length

  const moderateEvents = adverseEvents.filter(
    (event) => event.severity === "Moderate"
  ).length

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <div className="flex items-center gap-2">

            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <ShieldAlert size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Pharmacovigilance
            </h1>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Monitor adverse events, serious adverse events and
            participant safety throughout clinical trials.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
          <Plus size={18} />
          Report Adverse Event
        </button>

      </div>

      {/* SAFETY STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total AE
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalEvents}
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
                Serious AE / SAE
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {seriousEvents}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <Siren size={22} />
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
              <Clock3 size={22} />
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Severe Events
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                {severeEvents}
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <AlertTriangle size={22} />
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Recovered / Closed
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {resolvedEvents}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>

          </div>
        </div>

      </div>

      {/* SAFETY OVERVIEW */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* SEVERITY */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Events by Severity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Distribution of adverse events by intensity.
              </p>
            </div>

            <HeartPulse
              size={20}
              className="text-red-500"
            />

          </div>

          <div className="mt-6 space-y-5">

            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="font-medium text-slate-700">
                  Mild
                </span>

                <span className="font-semibold text-emerald-600">
                  {mildEvents}
                </span>

              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${(mildEvents / totalEvents) * 100}%`,
                  }}
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="font-medium text-slate-700">
                  Moderate
                </span>

                <span className="font-semibold text-amber-600">
                  {moderateEvents}
                </span>

              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{
                    width: `${(moderateEvents / totalEvents) * 100}%`,
                  }}
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="font-medium text-slate-700">
                  Severe
                </span>

                <span className="font-semibold text-red-600">
                  {severeEvents}
                </span>

              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${(severeEvents / totalEvents) * 100}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* SAE ALERT */}
        <div className="rounded-xl border border-red-100 bg-red-50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-red-600">
              <Siren size={21} />
            </div>

            <div>

              <h2 className="font-semibold text-red-900">
                Serious Adverse Event Monitoring
              </h2>

              <p className="mt-1 text-sm text-red-700">
                Serious events require additional clinical review,
                follow-up and applicable reporting workflows.
              </p>

            </div>

          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">

            <div className="rounded-lg bg-white p-4">

              <p className="text-xs text-slate-500">
                Serious Events
              </p>

              <p className="mt-1 text-2xl font-bold text-red-600">
                {seriousEvents}
              </p>

            </div>

            <div className="rounded-lg bg-white p-4">

              <p className="text-xs text-slate-500">
                SAE Review
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-600">
                {
                  adverseEvents.filter(
                    (event) => event.status === "SAE Review"
                  ).length
                }
              </p>

            </div>

            <div className="rounded-lg bg-white p-4">

              <p className="text-xs text-slate-500">
                Reported
              </p>

              <p className="mt-1 text-2xl font-bold text-purple-600">
                {
                  adverseEvents.filter(
                    (event) => event.status === "Reported"
                  ).length
                }
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* WORKFLOW */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="font-semibold text-slate-900">
          Safety Event Workflow
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Track an adverse event from initial reporting to final
          outcome.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-5">

          {[
            {
              title: "Report",
              icon: FileText,
            },
            {
              title: "Assess",
              icon: ClipboardCheckIcon,
            },
            {
              title: "Classify",
              icon: AlertTriangle,
            },
            {
              title: "Follow-up",
              icon: Activity,
            },
            {
              title: "Close",
              icon: CheckCircle2,
            },
          ].map((step, index) => {

            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="relative rounded-lg border border-slate-100 bg-slate-50 p-4"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-600">
                    <Icon size={18} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      {index + 1}. {step.title}
                    </p>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </div>

      {/* SEARCH / FILTERS */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-3 lg:grid-cols-4">

          <div className="relative lg:col-span-1">

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
              placeholder="Search AE, participant, trial..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-red-500 focus:bg-white"
            />

          </div>

          <select
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-500"
          >

            <option value="All">
              All Severity
            </option>

            <option value="Mild">
              Mild
            </option>

            <option value="Moderate">
              Moderate
            </option>

            <option value="Severe">
              Severe
            </option>

          </select>

          <select
            value={seriousnessFilter}
            onChange={(event) =>
              setSeriousnessFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-500"
          >

            <option value="All">
              All Seriousness
            </option>

            <option value="Serious">
              Serious
            </option>

            <option value="Non-Serious">
              Non-Serious
            </option>

          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-500"
          >

            <option value="All">
              All Status
            </option>

            <option value="Under Review">
              Under Review
            </option>

            <option value="SAE Review">
              SAE Review
            </option>

            <option value="Reported">
              Reported
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>

        </div>

      </div>

      {/* AE TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>

            <h2 className="font-semibold text-slate-900">
              Adverse Events
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredEvents.length} event(s) found
            </p>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1550px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  AE Record
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Participant
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Event
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Severity
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Seriousness
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Causality
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Outcome
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

              {filteredEvents.map((event) => (

                <tr
                  key={event.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* AE RECORD */}
                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-red-600">
                      {event.id}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Reported {event.reportedDate}
                    </p>

                  </td>

                  {/* PARTICIPANT */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserRound size={15} />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {event.participant}
                        </p>

                        <p className="text-xs text-slate-500">
                          {event.site}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* TRIAL */}
                  <td className="max-w-[250px] px-5 py-4">

                    <p className="text-xs font-semibold text-blue-600">
                      {event.trialId}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {event.trialTitle}
                    </p>

                  </td>

                  {/* EVENT */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-semibold text-slate-800">
                      {event.event}
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">

                      <CalendarDays size={12} />

                      Onset: {event.onsetDate}

                    </div>

                  </td>

                  {/* SEVERITY */}
                  <td className="px-5 py-4">
                    <SeverityBadge
                      severity={event.severity}
                    />
                  </td>

                  {/* SERIOUSNESS */}
                  <td className="px-5 py-4">
                    <SeriousnessBadge
                      seriousness={event.seriousness}
                    />
                  </td>

                  {/* CAUSALITY */}
                  <td className="px-5 py-4">

                    <span className="text-sm font-medium text-slate-700">
                      {event.causality}
                    </span>

                  </td>

                  {/* OUTCOME */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-slate-700">
                      {event.outcome}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {event.action}
                    </p>

                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">

                    <StatusBadge
                      status={event.status}
                    />

                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1">

                      <button
                        title="View Adverse Event"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
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

        {filteredEvents.length === 0 && (

          <div className="px-6 py-16 text-center">

            <ShieldAlert
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No adverse events found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>

      {/* SAFETY INFORMATION */}
      <div className="rounded-xl border border-red-100 bg-red-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-red-600">
            <ShieldAlert size={20} />
          </div>

          <div>

            <h3 className="font-semibold text-red-900">
              Participant Safety Monitoring
            </h3>

            <p className="mt-1 text-sm text-red-700">
              Pharmacovigilance records help investigators monitor
              participant safety, document adverse events, perform
              clinical assessments and maintain traceable follow-up
              records.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

/*
  Small reusable icon wrapper.
  This avoids importing another component just for the workflow.
*/
function ClipboardCheckIcon(props) {
  return <FileText {...props} />
}

export default Pharmacovigilance