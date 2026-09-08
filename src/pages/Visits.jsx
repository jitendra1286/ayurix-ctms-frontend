import { useEffect, useMemo, useState } from "react";
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
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import api from "../services/api";

function StatusBadge({ status }) {
  const normalized = String(status || "").toUpperCase();

  const config = {
    SCHEDULED: {
      className: "bg-blue-50 text-blue-700",
      icon: Clock3,
      label: "Scheduled",
    },
    COMPLETED: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
      label: "Completed",
    },
    MISSED: {
      className: "bg-red-50 text-red-700",
      icon: XCircle,
      label: "Missed",
    },
  };

  const current = config[normalized] || config.SCHEDULED;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      <Icon size={13} />
      {current.label}
    </span>
  );
}

function CheckInBadge({ status }) {
  if (status === "RFID") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <ScanLine size={13} />
        RFID
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock3 size={13} />
        Pending
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-slate-400">
      No Check-in
    </span>
  );
}

const emptyForm = {
  trial_id: "",
  participant_id: "",
  visit_name: "",
  scheduled_date: "",
  completed_date: "",
  status: "SCHEDULED",
  notes: "",
};

function Visits() {
  const [visits, setVisits] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [trials, setTrials] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // FETCH DATA
  // --------------------------------------------------

  const fetchVisits = async () => {
    try {
      const response = await api.get("/visits");

      setVisits(response.data.visits || []);
    } catch (err) {
      console.error("Fetch Visits Error:", err);

      setError(
        err.response?.data?.message || "Failed to load visits"
      );
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await api.get("/participants");

      setParticipants(response.data.participants || []);
    } catch (err) {
      console.error("Fetch Participants Error:", err);
    }
  };

  const fetchTrials = async () => {
    try {
      const response = await api.get("/trials");

      setTrials(response.data.trials || []);
    } catch (err) {
      console.error("Fetch Trials Error:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    await Promise.all([
      fetchVisits(),
      fetchParticipants(),
      fetchTrials(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const getParticipant = (participantId) => {
    return participants.find(
      (participant) =>
        Number(participant.id) === Number(participantId)
    );
  };

  const getTrial = (trialId) => {
    return trials.find(
      (trial) => Number(trial.id) === Number(trialId)
    );
  };

  const getParticipantCode = (participantId) => {
    const participant = getParticipant(participantId);

    return (
      participant?.participant_code ||
      `P-${String(participantId).padStart(4, "0")}`
    );
  };

  const getParticipantName = (participantId) => {
    const participant = getParticipant(participantId);

    if (!participant) {
      return "Participant";
    }

    return (
      participant.name ||
      participant.full_name ||
      participant.participant_code ||
      `Participant #${participant.id}`
    );
  };

  const getTrialName = (trialId) => {
    const trial = getTrial(trialId);

    return (
      trial?.title ||
      trial?.name ||
      `Trial #${trialId}`
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScheduledDateInput = (dateValue) => {
    if (!dateValue) return "";

    return String(dateValue).substring(0, 10);
  };

  // --------------------------------------------------
  // FILTERING
  // --------------------------------------------------

  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const participantCode = getParticipantCode(
        visit.participant_id
      );

      const participantName = getParticipantName(
        visit.participant_id
      );

      const trialName = getTrialName(visit.trial_id);

      const visitName = visit.visit_name || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        String(visit.id)
          .toLowerCase()
          .includes(searchText) ||
        participantCode
          .toLowerCase()
          .includes(searchText) ||
        participantName
          .toLowerCase()
          .includes(searchText) ||
        String(visit.trial_id)
          .toLowerCase()
          .includes(searchText) ||
        trialName
          .toLowerCase()
          .includes(searchText) ||
        visitName
          .toLowerCase()
          .includes(searchText);

      const normalizedStatus = String(
        visit.status || ""
      ).toUpperCase();

      const matchesStatus =
        statusFilter === "All" ||
        normalizedStatus === statusFilter.toUpperCase();

      const matchesType =
        typeFilter === "All" ||
        visitName === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    visits,
    participants,
    trials,
    search,
    statusFilter,
    typeFilter,
  ]);

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const totalVisits = visits.length;

  const scheduledVisits = visits.filter(
    (visit) =>
      String(visit.status).toUpperCase() === "SCHEDULED"
  ).length;

  const completedVisits = visits.filter(
    (visit) =>
      String(visit.status).toUpperCase() === "COMPLETED"
  ).length;

  const missedVisits = visits.filter(
    (visit) =>
      String(visit.status).toUpperCase() === "MISSED"
  ).length;

  const completionRate =
    totalVisits > 0
      ? Math.round(
          (completedVisits / totalVisits) * 100
        )
      : 0;

  // --------------------------------------------------
  // MODAL
  // --------------------------------------------------

  const openCreateModal = () => {
    setEditingVisit(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (visit) => {
    setEditingVisit(visit);

    setForm({
      trial_id: visit.trial_id || "",
      participant_id: visit.participant_id || "",
      visit_name: visit.visit_name || "",
      scheduled_date:
        getScheduledDateInput(visit.scheduled_date),
      completed_date:
        getScheduledDateInput(visit.completed_date),
      status: visit.status || "SCHEDULED",
      notes: visit.notes || "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingVisit(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.trial_id) {
      setError("Please select a clinical trial.");
      return;
    }

    if (!form.participant_id) {
      setError("Please select a participant.");
      return;
    }

    if (!form.visit_name.trim()) {
      setError("Please enter visit name.");
      return;
    }

    if (!form.scheduled_date) {
      setError("Please select scheduled date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        trial_id: Number(form.trial_id),
        participant_id: Number(form.participant_id),
        visit_name: form.visit_name.trim(),
        scheduled_date: form.scheduled_date,
        completed_date:
          form.completed_date || null,
        status: form.status,
        notes: form.notes.trim() || null,
      };

      if (editingVisit) {
        await api.put(
          `/visits/${editingVisit.id}`,
          payload
        );

        setSuccess("Visit updated successfully.");
      } else {
        await api.post("/visits", payload);

        setSuccess("Visit scheduled successfully.");
      }

      await fetchVisits();

      closeModal();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Save Visit Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save visit."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this visit?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/visits/${id}`);

      setVisits((previous) =>
        previous.filter(
          (visit) => Number(visit.id) !== Number(id)
        )
      );

      setSuccess("Visit deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Delete Visit Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete visit."
      );
    }
  };

  // --------------------------------------------------
  // VIEW
  // --------------------------------------------------

  const handleView = (visit) => {
    const participantName = getParticipantName(
      visit.participant_id
    );

    const trialName = getTrialName(
      visit.trial_id
    );

    window.alert(
      `Visit Details\n\n` +
        `Visit: ${visit.visit_name}\n` +
        `Participant: ${participantName}\n` +
        `Trial: ${trialName}\n` +
        `Scheduled: ${formatDate(
          visit.scheduled_date
        )}\n` +
        `Status: ${visit.status}\n` +
        `Notes: ${visit.notes || "No notes"}`
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* Success */}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* Error */}
      {error && !showModal && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

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

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Schedule Visit
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

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
              placeholder="Search visit, participant or trial..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

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

      {/* Table */}
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

          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading visits...
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[1100px] text-left">

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
                    Date
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

                {filteredVisits.map((visit) => {

                  const participantCode =
                    getParticipantCode(
                      visit.participant_id
                    );

                  const participantName =
                    getParticipantName(
                      visit.participant_id
                    );

                  const trialName =
                    getTrialName(
                      visit.trial_id
                    );

                  return (
                    <tr
                      key={visit.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Visit */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-blue-600">
                          VIS-{String(visit.id).padStart(3, "0")}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {visit.visit_name}
                        </p>
                      </td>

                      {/* Participant */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                            {participantCode.slice(-2)}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {participantName}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {participantCode}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Trial */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-blue-600">
                          TRIAL-{String(visit.trial_id).padStart(3, "0")}
                        </p>

                        <p className="mt-1 max-w-xs text-sm font-medium text-slate-800">
                          {trialName}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {formatDate(
                            visit.scheduled_date
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatTime(
                            visit.scheduled_date
                          )}
                        </p>
                      </td>

                      {/* Check-in */}
                      <td className="px-5 py-4">
                        <CheckInBadge
                          status={
                            visit.checkin_status ||
                            "Pending"
                          }
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
                            onClick={() =>
                              handleView(visit)
                            }
                            title="View Visit"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() =>
                              openEditModal(visit)
                            }
                            title="Edit Visit"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                visit.id
                              )
                            }
                            title="Delete Visit"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
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
                  );
                })}

              </tbody>

            </table>
          )}

          {!loading &&
            filteredVisits.length === 0 && (
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
            Participants with linked RFID cards can be automatically checked in when they arrive for a scheduled clinical trial visit.
          </p>
        </div>

      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingVisit
                    ? "Edit Visit"
                    : "Schedule New Visit"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingVisit
                    ? "Update clinical trial visit details."
                    : "Schedule a participant visit."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">

                {/* Trial */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Clinical Trial *
                  </label>

                  <select
                    name="trial_id"
                    value={form.trial_id}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">
                      Select Trial
                    </option>

                    {trials.map((trial) => (
                      <option
                        key={trial.id}
                        value={trial.id}
                      >
                        {trial.title ||
                          trial.name ||
                          `Trial #${trial.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Participant */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Participant *
                  </label>

                  <select
                    name="participant_id"
                    value={form.participant_id}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">
                      Select Participant
                    </option>

                    {participants.map(
                      (participant) => (
                        <option
                          key={participant.id}
                          value={participant.id}
                        >
                          {participant.participant_code ||
                            `Participant #${participant.id}`}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Visit Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Visit Name *
                  </label>

                  <select
                    name="visit_name"
                    value={form.visit_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">
                      Select Visit Type
                    </option>

                    <option value="Screening">
                      Screening
                    </option>

                    <option value="Baseline">
                      Baseline
                    </option>

                    <option value="Visit 02">
                      Visit 02
                    </option>

                    <option value="Visit 03">
                      Visit 03
                    </option>

                    <option value="Follow-up">
                      Follow-up
                    </option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Status *
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="SCHEDULED">
                      Scheduled
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="MISSED">
                      Missed
                    </option>
                  </select>
                </div>

                {/* Scheduled Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Scheduled Date *
                  </label>

                  <input
                    type="date"
                    name="scheduled_date"
                    value={form.scheduled_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Completed Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Completed Date
                  </label>

                  <input
                    type="date"
                    name="completed_date"
                    value={form.completed_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter visit notes..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CalendarDays size={17} />

                      {editingVisit
                        ? "Update Visit"
                        : "Schedule Visit"}
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

export default Visits;