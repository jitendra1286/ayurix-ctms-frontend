import { useMemo, useState } from "react"
import {
  BarChart3,
  Download,
  FileText,
  Users,
  Activity,
  CalendarCheck2,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock3,
  MapPin,
  Filter,
  PieChart,
  RefreshCw,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const trialData = [
  {
    id: "TRIAL-001",
    name: "Ayurvedic Intervention for Type 2 Diabetes",
    status: "Recruiting",
    target: 150,
    enrolled: 124,
    completed: 68,
    sites: 4,
    adverseEvents: 8,
  },
  {
    id: "TRIAL-002",
    name: "Ayurvedic Therapy for Chronic Arthritis",
    status: "Active",
    target: 120,
    enrolled: 96,
    completed: 52,
    sites: 3,
    adverseEvents: 5,
  },
  {
    id: "TRIAL-003",
    name: "Herbal Support in Migraine Management",
    status: "Recruiting",
    target: 100,
    enrolled: 72,
    completed: 39,
    sites: 3,
    adverseEvents: 4,
  },
  {
    id: "TRIAL-004",
    name: "Ayurvedic Formulation for Skin Disorders",
    status: "Active",
    target: 80,
    enrolled: 61,
    completed: 28,
    sites: 2,
    adverseEvents: 6,
  },
  {
    id: "TRIAL-005",
    name: "Ayurvedic Lifestyle Intervention Study",
    status: "Completed",
    target: 75,
    enrolled: 75,
    completed: 75,
    sites: 2,
    adverseEvents: 3,
  },
  {
    id: "TRIAL-006",
    name: "Ayurvedic Treatment for Sleep Disorders",
    status: "Recruiting",
    target: 90,
    enrolled: 54,
    completed: 21,
    sites: 2,
    adverseEvents: 7,
  },
]

const enrollmentTrend = [
  { month: "Mar", enrolled: 38, completed: 8 },
  { month: "Apr", enrolled: 56, completed: 14 },
  { month: "May", enrolled: 79, completed: 24 },
  { month: "Jun", enrolled: 104, completed: 37 },
  { month: "Jul", enrolled: 132, completed: 49 },
  { month: "Aug", enrolled: 161, completed: 63 },
  { month: "Sep", enrolled: 184, completed: 76 },
]

const sitePerformance = [
  {
    site: "AIIA New Delhi",
    enrolled: 82,
    target: 100,
    visits: 214,
    compliance: 96,
  },
  {
    site: "AIIA Ahmedabad",
    enrolled: 64,
    target: 80,
    visits: 178,
    compliance: 93,
  },
  {
    site: "AIIA Jaipur",
    enrolled: 58,
    target: 75,
    visits: 152,
    compliance: 91,
  },
  {
    site: "AIIA Bhopal",
    enrolled: 47,
    target: 60,
    visits: 126,
    compliance: 88,
  },
  {
    site: "AIIA Kochi",
    enrolled: 41,
    target: 55,
    visits: 109,
    compliance: 94,
  },
]

const safetyData = [
  {
    name: "Mild",
    value: 12,
  },
  {
    name: "Moderate",
    value: 15,
  },
  {
    name: "Severe",
    value: 5,
  },
]

const visitData = [
  {
    month: "Mar",
    scheduled: 90,
    completed: 78,
  },
  {
    month: "Apr",
    scheduled: 112,
    completed: 97,
  },
  {
    month: "May",
    scheduled: 138,
    completed: 121,
  },
  {
    month: "Jun",
    scheduled: 154,
    completed: 141,
  },
  {
    month: "Jul",
    scheduled: 181,
    completed: 164,
  },
  {
    month: "Aug",
    scheduled: 205,
    completed: 189,
  },
  {
    month: "Sep",
    scheduled: 224,
    completed: 207,
  },
]

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  valueClass,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p
            className={`mt-2 text-3xl font-bold ${
              valueClass || "text-slate-900"
            }`}
          >
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`rounded-lg p-3 ${
            iconClass || "bg-blue-50 text-blue-600"
          }`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}

function ReportsAnalytics() {
  const [trialFilter, setTrialFilter] = useState("All")
  const [reportType, setReportType] = useState("Clinical Overview")

  const filteredTrials = useMemo(() => {
    if (trialFilter === "All") {
      return trialData
    }

    return trialData.filter(
      (trial) => trial.status === trialFilter
    )
  }, [trialFilter])

  const totalTarget = trialData.reduce(
    (sum, trial) => sum + trial.target,
    0
  )

  const totalEnrolled = trialData.reduce(
    (sum, trial) => sum + trial.enrolled,
    0
  )

  const totalCompleted = trialData.reduce(
    (sum, trial) => sum + trial.completed,
    0
  )

  const totalAdverseEvents = trialData.reduce(
    (sum, trial) => sum + trial.adverseEvents,
    0
  )

  const enrollmentPercentage = Math.round(
    (totalEnrolled / totalTarget) * 100
  )

  const completionPercentage = Math.round(
    (totalCompleted / totalEnrolled) * 100
  )

  const activeTrials = trialData.filter(
    (trial) =>
      trial.status === "Active" ||
      trial.status === "Recruiting"
  ).length

  const handleGenerateReport = () => {
    alert(
      `${reportType} report generated successfully in demo mode.`
    )
  }

  const handleExport = () => {
    alert("Analytics report exported successfully in demo mode.")
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <BarChart3 size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Reports & Analytics
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Monitor clinical trial performance, enrollment,
            visits, sites and participant safety through analytics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Download size={17} />
            Export
          </button>

          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <FileText size={17} />
            Generate Report
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Analytics Controls
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Select the report type and trial status for analysis.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Filter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={reportType}
                onChange={(event) =>
                  setReportType(event.target.value)
                }
                className="rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="Clinical Overview">
                  Clinical Overview
                </option>
                <option value="Enrollment Report">
                  Enrollment Report
                </option>
                <option value="Site Performance">
                  Site Performance
                </option>
                <option value="Safety Report">
                  Safety Report
                </option>
                <option value="Visit Report">
                  Visit Report
                </option>
              </select>
            </div>

            <select
              value={trialFilter}
              onChange={(event) =>
                setTrialFilter(event.target.value)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Trials</option>
              <option value="Recruiting">Recruiting</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={() => {
                setTrialFilter("All")
                setReportType("Clinical Overview")
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Trials"
          value={activeTrials}
          subtitle="Recruiting / active studies"
          icon={Activity}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Total Participants"
          value={totalEnrolled}
          subtitle={`${enrollmentPercentage}% of target enrollment`}
          icon={Users}
          iconClass="bg-emerald-50 text-emerald-600"
          valueClass="text-emerald-600"
        />

        <StatCard
          title="Completed Participants"
          value={totalCompleted}
          subtitle={`${completionPercentage}% of enrolled participants`}
          icon={CheckCircle2}
          iconClass="bg-purple-50 text-purple-600"
          valueClass="text-purple-600"
        />

        <StatCard
          title="Adverse Events"
          value={totalAdverseEvents}
          subtitle="Across all active studies"
          icon={ShieldAlert}
          iconClass="bg-red-50 text-red-600"
          valueClass="text-red-600"
        />
      </div>

      {/* ENROLLMENT TREND */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">
              Participant Enrollment Trend
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Monthly enrollment and participant completion
              progress.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <TrendingUp size={17} />
            <span className="font-semibold">
              Positive enrollment trend
            </span>
          </div>
        </div>

        <div className="mt-6 h-[330px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="enrolled"
                name="Enrolled"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TWO CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* TRIAL ENROLLMENT */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Enrollment by Trial
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Compare target and actual participant enrollment.
            </p>
          </div>

          <div className="mt-6 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trialData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="id"
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="target"
                  name="Target"
                  fill="#cbd5e1"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="enrolled"
                  name="Enrolled"
                  fill="#4f46e5"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SAFETY */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Adverse Events by Severity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Overall adverse event distribution.
            </p>
          </div>

          <div className="mt-4 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={safetyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>

                <Tooltip />

                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-emerald-50 p-3 text-center">
              <p className="text-xs text-slate-500">
                Mild
              </p>

              <p className="mt-1 text-xl font-bold text-emerald-600">
                12
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-center">
              <p className="text-xs text-slate-500">
                Moderate
              </p>

              <p className="mt-1 text-xl font-bold text-amber-600">
                15
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-center">
              <p className="text-xs text-slate-500">
                Severe
              </p>

              <p className="mt-1 text-xl font-bold text-red-600">
                5
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VISIT ANALYTICS */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Visit Completion Analytics
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Scheduled versus completed participant visits.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <CalendarCheck2 size={20} />
          </div>
        </div>

        <div className="mt-6 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="scheduled"
                name="Scheduled"
                fill="#cbd5e1"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="completed"
                name="Completed"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SITE PERFORMANCE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">
              Site Performance
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Enrollment, visits and compliance performance by
              clinical trial site.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <TrendingUp size={16} />
            Average performance: 92%
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
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
                  Visits
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Compliance
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Performance
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sitePerformance.map((site) => {
                const percentage = Math.round(
                  (site.enrolled / site.target) * 100
                )

                return (
                  <tr
                    key={site.site}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <MapPin size={17} />
                        </div>

                        <span className="text-sm font-semibold text-slate-800">
                          {site.site}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-800">
                        {site.enrolled}
                      </span>

                      <span className="text-xs text-slate-400">
                        {" "}
                        / {site.target}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{
                              width: `${Math.min(
                                percentage,
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        <span className="text-xs font-semibold text-slate-600">
                          {percentage}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {site.visits}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          site.compliance >= 93
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {site.compliance}%
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {site.compliance >= 93 ? (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                          <TrendingUp size={15} />
                          Good
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                          <TrendingDown size={15} />
                          Attention
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRIAL PERFORMANCE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Trial Performance Summary
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Key performance indicators for each clinical trial.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Enrollment
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Completion
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sites
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  AE
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTrials.map((trial) => {
                const enrollment = Math.round(
                  (trial.enrolled / trial.target) * 100
                )

                const completion = Math.round(
                  (trial.completed / trial.enrolled) * 100
                )

                return (
                  <tr
                    key={trial.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="max-w-[350px] px-5 py-4">
                      <p className="text-xs font-semibold text-indigo-600">
                        {trial.id}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {trial.name}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          trial.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : trial.status === "Active"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {trial.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-800">
                          {trial.enrolled}/{trial.target}
                        </span>

                        <span className="text-xs text-slate-500">
                          {enrollment}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-800">
                          {trial.completed}
                        </span>

                        <span className="text-xs text-slate-500">
                          {completion}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-700">
                        {trial.sites}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
                        <ShieldAlert size={15} />
                        {trial.adverseEvents}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredTrials.length === 0 && (
          <div className="px-6 py-14 text-center">
            <BarChart3
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No trials found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing the selected trial filter.
            </p>
          </div>
        )}
      </div>

      {/* REPORT INFORMATION */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
            <PieChart size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-indigo-900">
              Analytics & Decision Support
            </h3>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              Reports combine trial, participant, visit, site and
              safety data to help research teams identify delays,
              monitor enrollment, compare site performance and
              review participant safety trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsAnalytics