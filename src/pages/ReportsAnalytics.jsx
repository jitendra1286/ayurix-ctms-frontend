import { useEffect, useMemo, useState } from "react"
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

import api from "../services/api"

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

  const [overview, setOverview] = useState({
    totalTrials: 0,
    totalParticipants: 0,
    completedParticipants: 0,
    totalAdverseEvents: 0,
    activeTrials: 0,
    totalSites: 0,
  })

  const [trialData, setTrialData] = useState([])
  const [enrollmentTrend, setEnrollmentTrend] = useState([])
  const [sitePerformance, setSitePerformance] = useState([])
  const [safetyData, setSafetyData] = useState([])
  const [visitData, setVisitData] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  /*
  |--------------------------------------------------------------------------
  | LOAD REPORT DATA
  |--------------------------------------------------------------------------
  */

  const loadReports = async () => {
    try {
      setLoading(true)
      setError("")

      const [
        overviewResponse,
        trialsResponse,
        enrollmentResponse,
        visitsResponse,
        sitesResponse,
        safetyResponse,
      ] = await Promise.all([
        api.get("/reports/overview"),
        api.get("/reports/trials"),
        api.get("/reports/enrollment-trend"),
        api.get("/reports/visits"),
        api.get("/reports/sites"),
        api.get("/reports/safety"),
      ])

      setOverview(
        overviewResponse.data?.data || {
          totalTrials: 0,
          totalParticipants: 0,
          completedParticipants: 0,
          totalAdverseEvents: 0,
          activeTrials: 0,
          totalSites: 0,
        }
      )

      setTrialData(trialsResponse.data?.data || [])
      setEnrollmentTrend(enrollmentResponse.data?.data || [])
      setVisitData(visitsResponse.data?.data || [])
      setSitePerformance(sitesResponse.data?.data || [])
      setSafetyData(safetyResponse.data?.data || [])
    } catch (err) {
      console.error("Reports API error:", err)

      if (err.response?.status === 401) {
        setError("Authorization token is required. Please login again.")
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load reports and analytics."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | FILTERED TRIALS
  |--------------------------------------------------------------------------
  */

  const filteredTrials = useMemo(() => {
    if (trialFilter === "All") {
      return trialData
    }

    return trialData.filter((trial) => {
      if (trialFilter === "Recruiting") {
        return trial.status === "RECRUITING"
      }

      if (trialFilter === "Active") {
        return trial.status === "ACTIVE"
      }

      if (trialFilter === "Completed") {
        return trial.status === "COMPLETED"
      }

      return true
    })
  }, [trialFilter, trialData])

  /*
  |--------------------------------------------------------------------------
  | CALCULATIONS
  |--------------------------------------------------------------------------
  */

  const totalEnrolled = Number(overview.totalParticipants || 0)

  const totalCompleted = Number(
    overview.completedParticipants || 0
  )

  const totalAdverseEvents = Number(
    overview.totalAdverseEvents || 0
  )

  const completionPercentage =
    totalEnrolled > 0
      ? Math.round((totalCompleted / totalEnrolled) * 100)
      : 0

  /*
  |--------------------------------------------------------------------------
  | SITE PERFORMANCE
  |--------------------------------------------------------------------------
  */

  const averageSitePerformance = useMemo(() => {
    if (!sitePerformance.length) {
      return 0
    }

    const total = sitePerformance.reduce((sum, site) => {
      if (!site.target || site.target === 0) {
        return sum
      }

      return (
        sum +
        Math.round((site.enrolled / site.target) * 100)
      )
    }, 0)

    return Math.round(total / sitePerformance.length)
  }, [sitePerformance])

  /*
  |--------------------------------------------------------------------------
  | REPORT ACTIONS
  |--------------------------------------------------------------------------
  */

  const handleGenerateReport = () => {
    alert(
      `${reportType} report generated successfully.`
    )
  }

  const handleExport = () => {
    const report = {
      overview,
      trials: filteredTrials,
      enrollmentTrend,
      visits: visitData,
      sites: sitePerformance,
      safety: safetyData,
    }

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      {
        type: "application/json",
      }
    )

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement("a")

    link.href = url
    link.download = "ayurix-ctms-analytics-report.json"

    document.body.appendChild(link)

    link.click()

    link.remove()

    window.URL.revokeObjectURL(url)
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Loading reports and analytics...
          </p>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert
            size={22}
            className="mt-0.5 text-red-600"
          />

          <div>
            <h2 className="font-semibold text-red-800">
              Unable to load Reports & Analytics
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={loadReports}
              className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
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
            Monitor real-time clinical trial performance,
            enrollment, visits, sites and participant safety.
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
              Select report type and trial status for analysis.
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
              <option value="All">
                All Trials
              </option>

              <option value="Recruiting">
                Recruiting
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

            <button
              onClick={() => {
                setTrialFilter("All")
                setReportType("Clinical Overview")
                loadReports()
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Active Trials"
          value={overview.activeTrials}
          subtitle="Recruiting / active studies"
          icon={Activity}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Total Participants"
          value={totalEnrolled}
          subtitle="Registered participants"
          icon={Users}
          iconClass="bg-emerald-50 text-emerald-600"
          valueClass="text-emerald-600"
        />

        <StatCard
          title="Completed Participants"
          value={totalCompleted}
          subtitle={`${completionPercentage}% of participants completed`}
          icon={CheckCircle2}
          iconClass="bg-purple-50 text-purple-600"
          valueClass="text-purple-600"
        />

        <StatCard
          title="Adverse Events"
          value={totalAdverseEvents}
          subtitle="Reported safety events"
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
              Monthly enrollment and completion progress.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <TrendingUp size={17} />
            Live database analytics
          </div>

        </div>

        <div className="mt-6 h-[330px] w-full">

          {enrollmentTrend.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
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
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No enrollment data available.
            </div>
          )}

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
              Compare participant enrollment across trials.
            </p>
          </div>

          <div className="mt-6 h-[320px] w-full">

            {trialData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
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
                    dataKey="enrolled"
                    name="Enrolled"
                    fill="#4f46e5"
                    radius={[5, 5, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No trial data available.
              </div>
            )}

          </div>
        </div>

        {/* SAFETY */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div>
            <h2 className="font-semibold text-slate-900">
              Adverse Events by Severity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Real adverse event distribution from database.
            </p>
          </div>

          <div className="mt-4 h-[250px] w-full">

            {safetyData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
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
                    {safetyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#10b981"
                            : index === 1
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No adverse event data available.
              </div>
            )}

          </div>

          <div className="grid grid-cols-3 gap-3">

            {["MILD", "MODERATE", "SEVERE"].map(
              (severity) => {
                const item = safetyData.find(
                  (data) =>
                    String(data.name).toUpperCase() ===
                    severity
                )

                return (
                  <div
                    key={severity}
                    className="rounded-lg bg-slate-50 p-3 text-center"
                  >
                    <p className="text-xs text-slate-500">
                      {severity}
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-700">
                      {item?.value || 0}
                    </p>
                  </div>
                )
              }
            )}

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

          {visitData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
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
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No visit data available.
            </div>
          )}

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
              Participants and visits by clinical trial site.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <TrendingUp size={16} />
            {averageSitePerformance > 0
              ? `Average enrollment: ${averageSitePerformance}%`
              : "No target data available"}
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Site
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Participants
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Visits
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {sitePerformance.map((site) => {

                return (
                  <tr
                    key={site.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <MapPin size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {site.site}
                          </p>

                          <p className="text-xs text-slate-400">
                            {site.siteCode}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <span className="text-sm font-semibold text-slate-800">
                        {site.enrolled}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-slate-700">
                        {site.visits}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span className="text-sm text-slate-600">
                        {[site.city, site.state]
                          .filter(Boolean)
                          .join(", ") || "India"}
                      </span>

                    </td>

                  </tr>
                )
              })}

            </tbody>

          </table>

        </div>

        {sitePerformance.length === 0 && (
          <div className="px-6 py-14 text-center">

            <MapPin
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No site data found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add clinical sites to see site analytics.
            </p>

          </div>
        )}

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

          <table className="w-full min-w-[1000px] text-left">

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
                  AE
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredTrials.map((trial) => {

                const enrollment =
                  trial.target && trial.target > 0
                    ? Math.round(
                        (trial.enrolled /
                          trial.target) *
                          100
                      )
                    : null

                const completion =
                  trial.enrolled > 0
                    ? Math.round(
                        (trial.completed /
                          trial.enrolled) *
                          100
                      )
                    : 0

                return (
                  <tr
                    key={trial.databaseId || trial.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="max-w-[400px] px-5 py-4">

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
                          trial.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700"
                            : trial.status === "ACTIVE"
                              ? "bg-blue-50 text-blue-700"
                              : trial.status === "RECRUITING"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {trial.status}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <span className="text-sm font-semibold text-slate-800">
                          {trial.enrolled}
                        </span>

                        {enrollment !== null && (
                          <span className="text-xs text-slate-500">
                            {enrollment}%
                          </span>
                        )}

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
              Reports combine real trial, participant, visit,
              site and safety data from the AYURIX CTMS database
              to help research teams monitor clinical operations
              and participant safety.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ReportsAnalytics