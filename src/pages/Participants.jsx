import { useEffect, useMemo, useState } from "react";
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
  RefreshCw,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import api from "../services/api";

// ======================================================
// STATUS BADGE
// ======================================================
function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    SCREENING: "bg-amber-50 text-amber-700",
    COMPLETED: "bg-slate-100 text-slate-700",
    WITHDRAWN: "bg-red-50 text-red-700",
  };

  const labels = {
    ACTIVE: "Active",
    SCREENING: "Screening",
    COMPLETED: "Completed",
    WITHDRAWN: "Withdrawn",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] || status || "Unknown"}
    </span>
  );
}

// ======================================================
// RFID BADGE
// ======================================================
function RfidBadge({ status }) {
  if (status === "Linked") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        <ScanLine size={13} />
        RFID Linked
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
      <ScanLine size={13} />
      Not Linked
    </span>
  );
}

// ======================================================
// EMPTY FORM
// ======================================================
const emptyForm = {
  participant_code: "",
  trial_id: "",
  site_id: "",
  age: "",
  gender: "",
  enrollment_date: "",
  status: "SCREENING",
};

// ======================================================
// PARTICIPANTS PAGE
// ======================================================
function Participants() {
  const [participants, setParticipants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // ======================================================
  // GET PARTICIPANTS
  // ======================================================
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/participants");

      if (response.data.success) {
        setParticipants(response.data.participants || []);
      } else {
        setError(
          response.data.message || "Failed to fetch participants"
        );
      }
    } catch (err) {
      console.error("Fetch Participants Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // ======================================================
  // FORM CHANGE
  // ======================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // OPEN ADD MODAL
  // ======================================================
  const openAddModal = () => {
    setEditingParticipant(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ======================================================
  // OPEN EDIT MODAL
  // ======================================================
  const openEditModal = (participant) => {
    setEditingParticipant(participant);

    setForm({
      participant_code: participant.participant_code || "",
      trial_id: participant.trial_id || "",
      site_id: participant.site_id || "",
      age: participant.age || "",
      gender: participant.gender || "",
      enrollment_date: participant.enrollment_date
        ? String(participant.enrollment_date).substring(0, 10)
        : "",
      status: participant.status || "SCREENING",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingParticipant(null);
    setForm(emptyForm);
  };

  // ======================================================
  // CREATE PARTICIPANT
  // ======================================================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.participant_code.trim()) {
      setError("Participant code is required.");
      return;
    }

    if (!form.trial_id) {
      setError("Trial ID is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.post("/participants", {
        participant_code: form.participant_code,
        trial_id: Number(form.trial_id),
        site_id: form.site_id
          ? Number(form.site_id)
          : null,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        enrollment_date: form.enrollment_date || null,
        status: form.status || "SCREENING",
      });

      if (response.data.success) {
        setShowModal(false);
        setForm(emptyForm);

        await fetchParticipants();

        setSuccess("Participant created successfully.");

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(
          response.data.message ||
            "Failed to create participant."
        );
      }
    } catch (err) {
      console.error("Create Participant Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create participant."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // UPDATE PARTICIPANT
  // ======================================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingParticipant) return;

    if (!form.participant_code.trim()) {
      setError("Participant code is required.");
      return;
    }

    if (!form.trial_id) {
      setError("Trial ID is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/participants/${editingParticipant.id}`,
        {
          participant_code: form.participant_code,
          trial_id: Number(form.trial_id),
          site_id: form.site_id
            ? Number(form.site_id)
            : null,
          age: form.age ? Number(form.age) : null,
          gender: form.gender || null,
          enrollment_date: form.enrollment_date || null,
          status: form.status || "SCREENING",
        }
      );

      if (response.data.success) {
        setShowModal(false);
        setEditingParticipant(null);
        setForm(emptyForm);

        await fetchParticipants();

        setSuccess("Participant updated successfully.");

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(
          response.data.message ||
            "Failed to update participant."
        );
      }
    } catch (err) {
      console.error("Update Participant Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update participant."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // DELETE PARTICIPANT
  // ======================================================
  const handleDelete = async (participant) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete participant "${participant.participant_code}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(participant.id);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/participants/${participant.id}`
      );

      if (response.data.success) {
        await fetchParticipants();

        setSuccess("Participant deleted successfully.");

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(
          response.data.message ||
            "Failed to delete participant."
        );
      }
    } catch (err) {
      console.error("Delete Participant Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete participant."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ======================================================
  // RFID STATUS
  // ======================================================
  const participantsWithRfid = useMemo(() => {
    return participants.map((participant) => ({
      ...participant,
      rfidStatus: "Not Linked",
    }));
  }, [participants]);

  // ======================================================
  // FILTER
  // ======================================================
  const filteredParticipants = useMemo(() => {
    return participantsWithRfid.filter((participant) => {
      const searchText = search.toLowerCase();

      const participantCode = String(
        participant.participant_code || ""
      ).toLowerCase();

      const participantId = String(
        participant.id || ""
      ).toLowerCase();

      const trialId = String(
        participant.trial_id || ""
      ).toLowerCase();

      const siteId = String(
        participant.site_id || ""
      ).toLowerCase();

      const matchesSearch =
        participantCode.includes(searchText) ||
        participantId.includes(searchText) ||
        trialId.includes(searchText) ||
        siteId.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        participant.status === statusFilter;

      const matchesGender =
        genderFilter === "All" ||
        participant.gender === genderFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGender
      );
    });
  }, [
    participantsWithRfid,
    search,
    statusFilter,
    genderFilter,
  ]);

  // ======================================================
  // COUNTS
  // ======================================================
  const activeCount = participants.filter(
    (participant) => participant.status === "ACTIVE"
  ).length;

  const screeningCount = participants.filter(
    (participant) => participant.status === "SCREENING"
  ).length;

  const completedCount = participants.filter(
    (participant) => participant.status === "COMPLETED"
  ).length;

  const linkedRfidCount = participantsWithRfid.filter(
    (participant) => participant.rfidStatus === "Linked"
  ).length;

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}
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

        <div className="flex gap-2">

          <button
            onClick={fetchParticipants}
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
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Participant
          </button>

        </div>

      </div>

      {/* ==================================================
          ERROR
      ================================================== */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <p className="text-sm font-medium text-red-600">
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

      {/* ==================================================
          SUCCESS
      ================================================== */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

          <p className="text-sm font-medium text-emerald-700">
            {success}
          </p>

        </div>
      )}

      {/* ==================================================
          SUMMARY
      ================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

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

      {/* ==================================================
          FILTERS
      ================================================== */}
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
              placeholder="Search participant ID, trial or site..."
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
            <option value="All">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="SCREENING">
              Screening
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="WITHDRAWN">
              Withdrawn
            </option>
          </select>

          <select
            value={genderFilter}
            onChange={(event) =>
              setGenderFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">
              All Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>
          </select>

        </div>

      </div>

      {/* ==================================================
          TABLE
      ================================================== */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Participant Registry
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Loading participants..."
                : `${filteredParticipants.length} participant(s) found`}
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
              Loading participants...
            </p>

          </div>
        ) : (
          <>

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
                      Enrollment
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

                      {/* PARTICIPANT */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-700">
                            {String(
                              participant.participant_code ||
                                participant.id
                            ).slice(-2)}
                          </div>

                          <div>

                            <p className="text-sm font-semibold text-slate-900">
                              {participant.participant_code ||
                                `Participant ${participant.id}`}
                            </p>

                            <p className="mt-1 text-xs font-medium text-blue-600">
                              ID: {participant.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* DEMOGRAPHICS */}
                      <td className="px-5 py-4">

                        <p className="text-sm text-slate-700">
                          {participant.age
                            ? `${participant.age} years`
                            : "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {participant.gender || "N/A"}
                        </p>

                      </td>

                      {/* TRIAL */}
                      <td className="px-5 py-4">

                        <p className="text-xs font-semibold text-blue-600">
                          Trial ID:{" "}
                          {participant.trial_id || "N/A"}
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-800">
                          Site ID:{" "}
                          {participant.site_id || "N/A"}
                        </p>

                      </td>

                      {/* ENROLLMENT */}
                      <td className="px-5 py-4">

                        {participant.enrollment_date ? (
                          <div>

                            <p className="text-sm font-medium text-slate-700">
                              {String(
                                participant.enrollment_date
                              ).substring(0, 10)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Enrolled
                            </p>

                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Not available
                          </span>
                        )}

                      </td>

                      {/* RFID */}
                      <td className="px-5 py-4">

                        <RfidBadge
                          status={participant.rfidStatus}
                        />

                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <StatusBadge
                          status={participant.status}
                        />

                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1">

                          {/* EDIT */}
                          <button
                            title="Edit Participant"
                            onClick={() =>
                              openEditModal(participant)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={17} />
                          </button>

                          {/* DELETE */}
                          <button
                            title="Delete Participant"
                            onClick={() =>
                              handleDelete(participant)
                            }
                            disabled={
                              deletingId === participant.id
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            {deletingId === participant.id ? (
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
                            title="View Participant"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={17} />
                          </button>

                          {/* MORE */}
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

            {/* EMPTY */}
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
                  Try changing your search or add a new participant.
                </p>

              </div>
            )}

          </>
        )}

      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}
      <div className="flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 sm:flex-row sm:items-center">

        <ScanLine size={18} />

        <p>
          RFID-enabled participants can use the Smart Check-in system
          for scheduled clinical trial visits.
        </p>

      </div>

      {/* ==================================================
          ADD / EDIT MODAL
      ================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  {editingParticipant
                    ? "Edit Participant"
                    : "Add Participant"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingParticipant
                    ? "Update participant information."
                    : "Register a new clinical trial participant."}
                </p>

              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={
                editingParticipant
                  ? handleUpdate
                  : handleCreate
              }
              className="space-y-5 p-6"
            >

              {/* PARTICIPANT CODE */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Participant Code *
                </label>

                <input
                  type="text"
                  name="participant_code"
                  value={form.participant_code}
                  onChange={handleChange}
                  placeholder="e.g. P-001"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* TRIAL + SITE */}
              <div className="grid gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Trial ID *
                  </label>

                  <input
                    type="number"
                    name="trial_id"
                    value={form.trial_id}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                    required
                    min="1"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Site ID
                  </label>

                  <input
                    type="number"
                    name="site_id"
                    value={form.site_id}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                    min="1"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* AGE + GENDER */}
              <div className="grid gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="e.g. 32"
                    min="1"
                    max="120"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              {/* DATE + STATUS */}
              <div className="grid gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Enrollment Date
                  </label>

                  <input
                    type="date"
                    name="enrollment_date"
                    value={form.enrollment_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />

                </div>

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
                    <option value="SCREENING">
                      Screening
                    </option>

                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="WITHDRAWN">
                      Withdrawn
                    </option>

                  </select>

                </div>

              </div>

              {/* FORM ERROR */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">

                  <p className="text-sm text-red-600">
                    {error}
                  </p>

                </div>
              )}

              {/* BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      {editingParticipant
                        ? "Updating..."
                        : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingParticipant ? (
                        <>
                          <Pencil size={17} />
                          Update Participant
                        </>
                      ) : (
                        <>
                          <Plus size={17} />
                          Add Participant
                        </>
                      )}
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

export default Participants;