import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  FlaskConical,
  Clock3,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

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
} from "recharts";

import api from "../services/api";

const icons = [
  FlaskConical,
  Users,
  Clock3,
  AlertTriangle,
];

const chartColors = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#64748b",
];

function Dashboard() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState({
    totalTrials: 0,
    activeTrials: 0,
    totalParticipants: 0,
    completedParticipants: 0,
    totalAdverseEvents: 0,
    totalSites: 0,
  });

  const [trialData, setTrialData] = useState([]);
  const [enrollmentTrend, setEnrollmentTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD DASHBOARD DATA
     ===================================================== */

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        overviewResponse,
        trialsResponse,
        enrollmentResponse,
      ] = await Promise.all([
        api.get("/reports/overview"),
        api.get("/reports/trials"),
        api.get("/reports/enrollment-trend"),
      ]);

      if (overviewResponse.data.success) {
        setOverview(overviewResponse.data.data);
      }

      if (trialsResponse.data.success) {
        setTrialData(trialsResponse.data.data || []);
      }

      if (enrollmentResponse.data.success) {
        setEnrollmentTrend(
          enrollmentResponse.data.data || []
        );
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);

      if (err.response?.status === 401) {
        setError(
          "Authorization token is required. Please login again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =====================================================
     KPI DATA
     ===================================================== */

  const dashboardStats = useMemo(
    () => [
      {
        title: "Active Clinical Trials",
        value: overview.activeTrials,
        change: `${overview.totalTrials} total`,
        description:
          "Currently active or recruiting trials",
      },
      {
        title: "Total Participants",
        value: overview.totalParticipants,
        change: `${overview.completedParticipants} completed`,
        description:
          "Participants across all trials",
      },
      {
        title: "Active Sites",
        value: overview.totalSites,
        change: "Database",
        description:
          "Currently active clinical sites",
      },
      {
        title: "Adverse Events",
        value: overview.totalAdverseEvents,
        change: "Safety",
        description:
          "Reported adverse events",
      },
    ],
    [overview]
  );

  /* =====================================================
     PARTICIPANT ENROLLMENT CHART
     ===================================================== */

  const chartData = useMemo(() => {
    let cumulative = 0;

    return enrollmentTrend.map((item) => {
      cumulative += Number(item.enrolled || 0);

      return {
        month: item.month,
        participants: cumulative,
      };
    });
  }, [enrollmentTrend]);

  /* =====================================================
     TRIAL STATUS DATA
     ===================================================== */

  const trialStatusData = useMemo(() => {
    const statusMap = {
      ACTIVE: "Active",
      RECRUITING: "Recruiting",
      ETHICS_REVIEW: "Review",
      REGULATORY_REVIEW: "Review",
      PLANNING: "Planning",
      COMPLETED: "Completed",
      SUSPENDED: "Suspended",
    };

    const counts = {};

    trialData.forEach((trial) => {
      const status =
        statusMap[trial.status] ||
        trial.status ||
        "Unknown";

      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [trialData]);

  /* =====================================================
     ACTIVE / RECENT TRIALS
     ===================================================== */

  const recentTrials = useMemo(() => {
    return trialData
      .filter(
        (trial) =>
          trial.status === "ACTIVE" ||
          trial.status === "RECRUITING"
      )
      .slice(0, 4);
  }, [trialData]);

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good morning, Research Admin
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening across your clinical
            trials today.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          {/* CREATE NEW TRIAL */}

          <button
            onClick={() => navigate("/clinical-trials")}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            + Create New Trial
          </button>

        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {dashboardStats.map((stat, index) => {
          const Icon = icons[index];

          const positive =
            index === 0 ||
            index === 1 ||
            index === 2;

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
                    positive
                      ? "text-emerald-600"
                      : "text-red-500"
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
          );
        })}

      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* PARTICIPANT ENROLLMENT */}

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

            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No enrollment data available
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

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
            )}

          </div>
        </div>

        {/* TRIAL STATUS */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Trial Status
          </h2>

          <p className="text-sm text-slate-500">
            Current trial distribution
          </p>

          <div className="mt-4 h-56">

            {trialStatusData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No trial data available
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
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
                    {trialStatusData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            chartColors[
                              index %
                                chartColors.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>
            )}

          </div>

          <div className="space-y-2">

            {trialStatusData.map(
              (item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >

                  <div className="flex items-center gap-2">

                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[
                            index %
                              chartColors.length
                          ],
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
              )
            )}

          </div>

        </div>

      </div>

      {/* =================================================
          BOTTOM SECTION
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* ACTIVE CLINICAL TRIALS */}

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

            <button
              onClick={() =>
                navigate("/clinical-trials")
              }
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>

          </div>

          <div className="divide-y divide-slate-100">

            {recentTrials.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No active clinical trials available.
              </div>
            ) : (
              recentTrials.map((trial) => {

                const enrollment =
                  Number(trial.enrolled || 0);

                const target =
                  Number(trial.target || 0);

                const progress =
                  target > 0
                    ? Math.min(
                        (enrollment / target) * 100,
                        100
                      )
                    : 0;

                return (
                  <div
                    key={
                      trial.databaseId ||
                      trial.id
                    }
                    className="p-5 transition hover:bg-slate-50"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-xs font-medium text-blue-600">
                          {trial.id}
                        </p>

                        <h3 className="mt-1 font-semibold text-slate-900">
                          {trial.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {trial.protocolNumber ||
                            "Protocol not available"}
                        </p>

                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {trial.status ===
                        "RECRUITING"
                          ? "Recruiting"
                          : "Active"}
                      </span>

                    </div>

                    <div className="mt-4">

                      <div className="mb-1 flex justify-between text-xs text-slate-500">

                        <span>
                          Enrollment
                        </span>

                        <span>
                          {enrollment}
                          {target > 0
                            ? `/${target}`
                            : ""}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width:
                              target > 0
                                ? `${progress}%`
                                : "0%",
                          }}
                        />

                      </div>

                      {target === 0 && (
                        <p className="mt-1 text-xs text-slate-400">
                          Target data not available
                        </p>
                      )}

                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* SYSTEM ACTIVITY */}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <h2 className="font-semibold text-slate-900">
              Recent Activity
            </h2>

            <p className="text-sm text-slate-500">
              Latest system information
            </p>

          </div>

          <div className="divide-y divide-slate-100">

            <div className="flex gap-4 p-5">

              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />

              <div className="flex-1">

                <p className="text-sm font-medium text-slate-900">
                  Clinical trial records
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {overview.totalTrials} trials
                  available in the system
                </p>

              </div>

            </div>

            <div className="flex gap-4 p-5">

              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />

              <div className="flex-1">

                <p className="text-sm font-medium text-slate-900">
                  Participant records
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {overview.totalParticipants} total
                  participants registered
                </p>

              </div>

            </div>

            <div className="flex gap-4 p-5">

              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />

              <div className="flex-1">

                <p className="text-sm font-medium text-slate-900">
                  Safety monitoring
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {overview.totalAdverseEvents} adverse
                  events recorded
                </p>

              </div>

            </div>

            <div className="flex gap-4 p-5">

              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />

              <div className="flex-1">

                <p className="text-sm font-medium text-slate-900">
                  Clinical sites
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {overview.totalSites} active sites
                  available
                </p>

              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;