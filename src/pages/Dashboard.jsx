import {
  Users,
  FlaskConical,
  Clock3,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import {
  dashboardStats,
  trials,
  activities,
} from "../data/mockData"

const chartData = [
  { month: "Jan", participants: 120 },
  { month: "Feb", participants: 180 },
  { month: "Mar", participants: 240 },
  { month: "Apr", participants: 310 },
  { month: "May", participants: 390 },
  { month: "Jun", participants: 450 },
  { month: "Jul", participants: 520 },
  { month: "Aug", participants: 610 },
]

const trialStatusData = [
  { name: "Active", value: 12 },
  { name: "Recruiting", value: 7 },
  { name: "Review", value: 3 },
  { name: "Completed", value: 2 },
]

const icons = [
  FlaskConical,
  Users,
  Clock3,
  AlertTriangle,
]

function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good morning, Research Admin
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening across your clinical trials today.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          + Create New Trial
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const Icon = icons[index]
          const positive = index !== 3

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                  <Icon size={21} />
                </div>

                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    positive ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {positive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}

                  {stat.change}
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {stat.title}
              </p>

              <h3 className="mt-1 text-3xl font-bold text-slate-900">
                {stat.value}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Participant Enrollment
            </h2>

            <p className="text-sm text-slate-500">
              Cumulative participant enrollment
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="participants"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Trial Status
          </h2>

          <p className="text-sm text-slate-500">
            Current trial distribution
          </p>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trialStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                >
                  {trialStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#2563eb",
                          "#10b981",
                          "#f59e0b",
                          "#64748b",
                        ][index]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {trialStatusData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: [
                        "#2563eb",
                        "#10b981",
                        "#f59e0b",
                        "#64748b",
                      ][index],
                    }}
                  />

                  <span className="text-slate-600">
                    {item.name}
                  </span>
                </div>

                <span className="font-semibold text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Trials */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Active Clinical Trials
              </h2>

              <p className="text-sm text-slate-500">
                Latest trial activity
              </p>
            </div>

            <button className="text-sm font-semibold text-blue-600">
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {trials.slice(0, 4).map((trial) => (
              <div
                key={trial.id}
                className="p-5 transition hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-blue-600">
                      {trial.id}
                    </p>

                    <h3 className="mt-1 font-semibold text-slate-900">
                      {trial.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {trial.site} • {trial.phase}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {trial.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Enrollment</span>

                    <span>
                      {trial.participants}/{trial.target}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${Math.min(
                          (trial.participants / trial.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">
              Recent Activity
            </h2>

            <p className="text-sm text-slate-500">
              Latest actions in the system
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex gap-4 p-5"
              >
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />

                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.action}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {activity.user} • {activity.target}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard