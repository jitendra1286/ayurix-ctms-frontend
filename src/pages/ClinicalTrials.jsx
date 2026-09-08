import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Eye,
  MoreHorizontal,
  RefreshCw,
  X,
  Pencil,
  Trash2,
   FlaskConical,
} from "lucide-react";

import api from "../services/api";

function StatusBadge({ status }) {
  const statusMap = {
    ACTIVE: {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700",
    },
    RECRUITING: {
      label: "Recruiting",
      className: "bg-blue-50 text-blue-700",
    },
    ETHICS_REVIEW: {
      label: "Ethics Review",
      className: "bg-amber-50 text-amber-700",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-slate-100 text-slate-700",
    },
    PLANNING: {
      label: "Planning",
      className: "bg-purple-50 text-purple-700",
    },
  };

  const current = statusMap[status] || {
    label: status || "Unknown",
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function ClinicalTrials() {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedTrial, setSelectedTrial] = useState(null);

  const emptyForm = {
    title: "",
    protocol_number: "",
    phase: "",
    study_type: "",
    sponsor: "",
    start_date: "",
    end_date: "",
    status: "PLANNING",
  };

  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // GET TRIALS
  // ==========================================
  const fetchTrials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/trials");

      if (response.data.success) {
        setTrials(response.data.trials || []);
      } else {
        setError(response.data.message || "Failed to fetch trials");
      }
    } catch (err) {
      console.error("Fetch Trials Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE TRIAL
  // ==========================================
  const handleCreateTrial = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Trial title is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await api.post("/trials", {
        title: form.title,
        protocol_number: form.protocol_number || null,
        phase: form.phase || null,
        study_type: form.study_type || null,
        sponsor: form.sponsor || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        status: form.status || "PLANNING",
      });

      if (response.data.success) {
        setShowCreateModal(false);
        setForm(emptyForm);

        await fetchTrials();
      } else {
        setError(
          response.data.message || "Failed to create trial."
        );
      }
    } catch (err) {
      console.error("Create Trial Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create clinical trial."
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const openEditModal = (trial) => {
    setSelectedTrial(trial);

    setForm({
      title: trial.title || "",
      protocol_number: trial.protocol_number || "",
      phase: trial.phase || "",
      study_type: trial.study_type || "",
      sponsor: trial.sponsor || "",
      start_date: trial.start_date
        ? String(trial.start_date).substring(0, 10)
        : "",
      end_date: trial.end_date
        ? String(trial.end_date).substring(0, 10)
        : "",
      status: trial.status || "PLANNING",
    });

    setError("");
    setShowEditModal(true);
  };

  // ==========================================
  // UPDATE TRIAL
  // ==========================================
  const handleUpdateTrial = async (e) => {
    e.preventDefault();

    if (!selectedTrial) return;

    if (!form.title.trim()) {
      setError("Trial title is required.");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await api.put(
        `/trials/${selectedTrial.id}`,
        {
          title: form.title,
          protocol_number: form.protocol_number || null,
          phase: form.phase || null,
          study_type: form.study_type || null,
          sponsor: form.sponsor || null,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          status: form.status || "PLANNING",
        }
      );

      if (response.data.success) {
        setShowEditModal(false);
        setSelectedTrial(null);
        setForm(emptyForm);

        await fetchTrials();
      } else {
        setError(
          response.data.message || "Failed to update trial."
        );
      }
    } catch (err) {
      console.error("Update Trial Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update clinical trial."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DELETE TRIAL
  // ==========================================
  const handleDeleteTrial = async (trial) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${trial.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(trial.id);
      setError("");

      const response = await api.delete(
        `/trials/${trial.id}`
      );

      if (response.data.success) {
        await fetchTrials();
      } else {
        setError(
          response.data.message || "Failed to delete trial."
        );
      }
    } catch (err) {
      console.error("Delete Trial Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete clinical trial."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================
  const filteredTrials = useMemo(() => {
    return trials.filter((trial) => {
      const searchText = search.toLowerCase();

      const trialId = String(
        trial.protocol_number || trial.id || ""
      ).toLowerCase();

      const title = String(
        trial.title || ""
      ).toLowerCase();

      const sponsor = String(
        trial.sponsor || ""
      ).toLowerCase();

      const matchesSearch =
        trialId.includes(searchText) ||
        title.includes(searchText) ||
        sponsor.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        trial.status === statusFilter;

      const matchesPhase =
        phaseFilter === "All" ||
        trial.phase === phaseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPhase
      );
    });
  }, [
    trials,
    search,
    statusFilter,
    phaseFilter,
  ]);

  // ==========================================
  // COUNTS
  // ==========================================
  const totalTrials = trials.length;

  const activeTrials = trials.filter(
    (trial) => trial.status === "ACTIVE"
  ).length;

  const recruitingTrials = trials.filter(
    (trial) => trial.status === "RECRUITING"
  ).length;

  const ethicsTrials = trials.filter(
    (trial) => trial.status === "ETHICS_REVIEW"
  ).length;

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="space-y-6">

      {/* HEADER */}
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

        <div className="flex gap-2">

          <button
            onClick={fetchTrials}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={() => {
              setForm(emptyForm);
              setError("");
              setShowCreateModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create New Trial
          </button>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>

        </div>
      )}

      {/* SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Trials
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalTrials}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {activeTrials}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Recruiting
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {recruitingTrials}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Under Review
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {ethicsTrials}
          </p>
        </div>

      </div>

      {/* FILTERS */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search trial ID, name or sponsor..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />

          </div>

          <div className="flex items-center gap-2">

            <SlidersHorizontal
              size={17}
              className="text-slate-400"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="PLANNING">
                Planning
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="RECRUITING">
                Recruiting
              </option>

              <option value="ETHICS_REVIEW">
                Ethics Review
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>

          </div>

          <select
            value={phaseFilter}
            onChange={(e) =>
              setPhaseFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">
              All Phases
            </option>

            <option value="Phase I">
              Phase I
            </option>

            <option value="Phase II">
              Phase II
            </option>

            <option value="Phase III">
              Phase III
            </option>

            <option value="Phase IV">
              Phase IV
            </option>
          </select>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Trial Registry
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Loading trials..."
                : `${filteredTrials.length} trial(s) found`}
            </p>
          </div>

        </div>

        {loading ? (
          <div className="px-6 py-16 text-center">

            <RefreshCw
              size={35}
              className="mx-auto animate-spin text-blue-500"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
              Loading clinical trials...
            </p>

          </div>
        ) : (
          <>
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] text-left">

                <thead className="bg-slate-50">

                  <tr className="border-b border-slate-200">

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Trial
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phase
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Study Type
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sponsor
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

                  {filteredTrials.map((trial) => (

                    <tr
                      key={trial.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* TRIAL */}
                      <td className="px-5 py-4">

                        <p className="text-xs font-semibold text-blue-600">
                          {trial.protocol_number ||
                            `TRIAL-${trial.id}`}
                        </p>

                        <p className="mt-1 max-w-xs font-semibold text-slate-900">
                          {trial.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID: {trial.id}
                        </p>

                      </td>

                      {/* PHASE */}
                      <td className="px-5 py-4">

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {trial.phase || "N/A"}
                        </span>

                      </td>

                      {/* STUDY TYPE */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {trial.study_type || "N/A"}
                      </td>

                      {/* SPONSOR */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {trial.sponsor || "N/A"}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={trial.status}
                        />
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1">

                          {/* EDIT */}
                          <button
                            title="Edit Trial"
                            onClick={() =>
                              openEditModal(trial)
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={17} />
                          </button>

                          {/* DELETE */}
                          <button
                            title="Delete Trial"
                            onClick={() =>
                              handleDeleteTrial(trial)
                            }
                            disabled={
                              deletingId === trial.id
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === trial.id ? (
                              <RefreshCw
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>

                          {/* VIEW */}
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

                  ))}

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
          </>
        )}

      </div>

      {/* ==========================================
          CREATE MODAL
      ========================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Create New Clinical Trial
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add a new trial to the AYURIX registry.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleCreateTrial}
              className="space-y-5 p-6"
            >

              <FormFields
                form={form}
                handleChange={handleChange}
              />

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {creating ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Trial
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ==========================================
          EDIT MODAL
      ========================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Edit Clinical Trial
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Update trial information.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleUpdateTrial}
              className="space-y-5 p-6"
            >

              <FormFields
                form={form}
                handleChange={handleChange}
              />

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Pencil size={17} />
                      Update Trial
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

// ==========================================
// FORM FIELDS
// ==========================================
function FormFields({ form, handleChange }) {
  return (
    <>
      {/* TITLE */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Trial Title *
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter clinical trial title"
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* PROTOCOL + SPONSOR */}
      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Protocol Number
          </label>

          <input
            type="text"
            name="protocol_number"
            value={form.protocol_number}
            onChange={handleChange}
            placeholder="e.g. AYU-CT-001"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Sponsor
          </label>

          <input
            type="text"
            name="sponsor"
            value={form.sponsor}
            onChange={handleChange}
            placeholder="e.g. AIIA"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* PHASE + STUDY TYPE */}
      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phase
          </label>

          <select
            name="phase"
            value={form.phase}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Select Phase</option>
            <option value="Phase I">Phase I</option>
            <option value="Phase II">Phase II</option>
            <option value="Phase III">Phase III</option>
            <option value="Phase IV">Phase IV</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Study Type
          </label>

          <select
            name="study_type"
            value={form.study_type}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Select Study Type</option>
            <option value="Interventional">
              Interventional
            </option>
            <option value="Observational">
              Observational
            </option>
          </select>
        </div>

      </div>

      {/* DATES */}
      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Date
          </label>

          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Date
          </label>

          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* STATUS */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Status
        </label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="PLANNING">Planning</option>
          <option value="ACTIVE">Active</option>
          <option value="RECRUITING">Recruiting</option>
          <option value="ETHICS_REVIEW">
            Ethics Review
          </option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
    </>
  );
}

export default ClinicalTrials;