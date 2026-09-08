import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Eye,
  Trash2,
  X,
  FileCheck2,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

import api from "../services/api";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
  "Expired",
];

const SUBMISSION_TYPES = [
  "CTRI Registration",
  "CTRI Update",
  "NDCT Compliance",
  "Regulatory Approval",
  "Amendment",
  "Annual Update",
  "Other",
];

const NDCT_OPTIONS = [
  "Pending",
  "Compliant",
  "Non-Compliant",
];

const AUTHORITY_OPTIONS = [
  "CTRI",
  "AYUSH",
  "CDSCO",
  "DCGI",
  "Other",
];

const initialForm = {
  trial_id: "",
  regulatory_authority: "CTRI",
  submission_type: "CTRI Registration",
  submission_date: "",
  approval_date: "",
  expiry_date: "",
  status: "PENDING",
  reference_number: "",
  ndct_compliance: "PENDING",
  remarks: "",
};

function formatDisplayDate(date) {
  if (!date) return "-";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-700";

    case "Submitted":
      return "bg-blue-100 text-blue-700";

    case "Under Review":
      return "bg-amber-100 text-amber-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    case "Expired":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-purple-100 text-purple-700";
  }
}

function getPriorityClass(status) {
  if (status === "Compliant") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Non-Compliant") {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

function toBackendStatus(status) {
  const statusMap = {
    Pending: "PENDING",
    Submitted: "SUBMITTED",
    "Under Review": "UNDER_REVIEW",
    Approved: "APPROVED",
    Rejected: "REJECTED",
    Expired: "EXPIRED",
  };

  return statusMap[status] || status;
}

function toBackendNdct(status) {
  const statusMap = {
    Pending: "PENDING",
    Compliant: "COMPLIANT",
    "Non-Compliant": "NON_COMPLIANT",
  };

  return statusMap[status] || status;
}

export default function RegulatoryCompliance() {
  const [records, setRecords] = useState([]);
  const [trials, setTrials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);

  /* =========================================================
     FETCH REGULATORY RECORDS
  ========================================================= */

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/regulatory");

      setRecords(response.data.records || []);
    } catch (err) {
      console.error("Fetch Regulatory Records Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load regulatory records"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH TRIALS
  ========================================================= */

  const fetchTrials = async () => {
    try {
      const response = await api.get("/trials");

      setTrials(response.data.trials || []);
    } catch (err) {
      console.error("Fetch Trials Error:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchTrials();
  }, []);

  /* =========================================================
     FILTER RECORDS
  ========================================================= */

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        record.id?.toLowerCase().includes(searchText) ||
        record.trialId?.toLowerCase().includes(searchText) ||
        record.trialTitle?.toLowerCase().includes(searchText) ||
        record.authority?.toLowerCase().includes(searchText) ||
        record.submissionType
          ?.toLowerCase()
          .includes(searchText) ||
        record.referenceNumber
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const total = records.length;

    const approved = records.filter(
      (item) => item.status === "Approved"
    ).length;

    const underReview = records.filter(
      (item) => item.status === "Under Review"
    ).length;

    const pending = records.filter(
      (item) =>
        item.status === "Pending" ||
        item.status === "Submitted"
    ).length;

    const expired = records.filter(
      (item) => item.status === "Expired"
    ).length;

    const compliant = records.filter(
      (item) => item.ndctCompliance === "Compliant"
    ).length;

    return {
      total,
      approved,
      underReview,
      pending,
      expired,
      compliant,
    };
  }, [records]);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     CREATE RECORD
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.trial_id) {
      alert("Please select a trial.");
      return;
    }

    if (!form.submission_type) {
      alert("Please select submission type.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/regulatory", {
        trial_id: Number(form.trial_id),

        regulatory_authority:
          form.regulatory_authority,

        submission_type:
          form.submission_type,

        submission_date:
          form.submission_date || null,

        approval_date:
          form.approval_date || null,

        expiry_date:
          form.expiry_date || null,

        status: form.status,

        reference_number:
          form.reference_number || null,

        ndct_compliance:
          form.ndct_compliance,

        remarks: form.remarks || null,
      });

      alert(
        "Regulatory record created successfully."
      );

      setForm(initialForm);

      setShowModal(false);

      await fetchRecords();
    } catch (err) {
      console.error(
        "Create Regulatory Record Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to create regulatory record."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     VIEW RECORD
  ========================================================= */

  const handleView = async (record) => {
    try {
      const databaseId =
        record.databaseId || record.id;

      const response = await api.get(
        `/regulatory/${databaseId}`
      );

      setSelectedRecord({
        ...record,
        ...response.data.record,
      });

      setShowViewModal(true);
    } catch (err) {
      console.error(
        "View Regulatory Record Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to load regulatory record."
      );
    }
  };

  /* =========================================================
     DELETE RECORD
  ========================================================= */

  const handleDelete = async (record) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${record.id}?`
    );

    if (!confirmed) return;

    try {
      const databaseId =
        record.databaseId || record.id;

      await api.delete(
        `/regulatory/${databaseId}`
      );

      alert(
        "Regulatory record deleted successfully."
      );

      await fetchRecords();
    } catch (err) {
      console.error(
        "Delete Regulatory Record Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete regulatory record."
      );
    }
  };

  /* =========================================================
     OPEN CREATE MODAL
  ========================================================= */

  const openCreateModal = () => {
    setForm(initialForm);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <ShieldCheck
                size={28}
                className="text-blue-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Regulatory Compliance
              </h1>

              <p className="text-sm text-slate-500">
                CTRI, NDCT and regulatory compliance
                tracking
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={19} />
          New Regulatory Record
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Records"
          value={stats.total}
          icon={<FileCheck2 size={22} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle2 size={22} />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={<Clock3 size={22} />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<AlertTriangle size={22} />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          title="NDCT Compliant"
          value={stats.compliant}
          icon={<ShieldCheck size={22} />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by compliance ID, trial, authority, reference..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">
                  Compliance
                </th>

                <th className="px-5 py-4">
                  Trial
                </th>

                <th className="px-5 py-4">
                  Authority
                </th>

                <th className="px-5 py-4">
                  Submission
                </th>

                <th className="px-5 py-4">
                  Submission Date
                </th>

                <th className="px-5 py-4">
                  NDCT
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading regulatory records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <ShieldCheck
                        size={42}
                        className="mb-3 text-slate-300"
                      />

                      <p className="font-medium text-slate-600">
                        No regulatory records found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Create your first regulatory
                        compliance record.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={
                      record.databaseId || record.id
                    }
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">
                        {record.id}
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        {record.referenceNumber !==
                        "-"
                          ? record.referenceNumber
                          : "No reference number"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-700">
                        {record.trialId}
                      </div>

                      <div className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                        {record.trialTitle}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {record.authority}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {record.submissionType}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDisplayDate(
                        record.submissionDate
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(
                          record.ndctCompliance
                        )}`}
                      >
                        {record.ndctCompliance}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleView(record)
                          }
                          title="View"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(record)
                          }
                          title="Delete"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          CREATE MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  New Regulatory Record
                </h2>

                <p className="text-sm text-slate-500">
                  Add CTRI / NDCT compliance information
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Trial */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Clinical Trial *
                </label>

                <select
                  name="trial_id"
                  value={form.trial_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Clinical Trial
                  </option>

                  {trials.map((trial) => (
                    <option
                      key={trial.id}
                      value={trial.id}
                    >
                      {trial.protocol_number
                        ? `${trial.protocol_number} - `
                        : ""}
                      {trial.title}
                    </option>
                  ))}
                </select>

                {trials.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    No clinical trials available.
                    Create a trial first.
                  </p>
                )}
              </div>

              {/* Authority + Submission Type */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormSelect
                  label="Regulatory Authority"
                  name="regulatory_authority"
                  value={
                    form.regulatory_authority
                  }
                  onChange={handleChange}
                  options={AUTHORITY_OPTIONS}
                />

                <FormSelect
                  label="Submission Type"
                  name="submission_type"
                  value={form.submission_type}
                  onChange={handleChange}
                  options={SUBMISSION_TYPES}
                />
              </div>

              {/* Dates */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormInput
                  label="Submission Date"
                  name="submission_date"
                  type="date"
                  value={form.submission_date}
                  onChange={handleChange}
                />

                <FormInput
                  label="Approval Date"
                  name="approval_date"
                  type="date"
                  value={form.approval_date}
                  onChange={handleChange}
                />

                <FormInput
                  label="Expiry Date"
                  name="expiry_date"
                  type="date"
                  value={form.expiry_date}
                  onChange={handleChange}
                />
              </div>

              {/* Status + NDCT */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormSelect
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={[
                    "PENDING",
                    "SUBMITTED",
                    "UNDER_REVIEW",
                    "APPROVED",
                    "REJECTED",
                    "EXPIRED",
                  ]}
                  displayMap={{
                    PENDING: "Pending",
                    SUBMITTED: "Submitted",
                    UNDER_REVIEW: "Under Review",
                    APPROVED: "Approved",
                    REJECTED: "Rejected",
                    EXPIRED: "Expired",
                  }}
                />

                <FormSelect
                  label="NDCT Compliance"
                  name="ndct_compliance"
                  value={
                    form.ndct_compliance
                  }
                  onChange={handleChange}
                  options={[
                    "PENDING",
                    "COMPLIANT",
                    "NON_COMPLIANT",
                  ]}
                  displayMap={{
                    PENDING: "Pending",
                    COMPLIANT: "Compliant",
                    NON_COMPLIANT: "Non-Compliant",
                  }}
                />
              </div>

              {/* Reference Number */}

              <FormInput
                label="Reference Number"
                name="reference_number"
                type="text"
                placeholder="e.g. CTRI/2026/00123"
                value={form.reference_number}
                onChange={handleChange}
              />

              {/* Remarks */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter additional compliance remarks..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selectedRecord.id}
                </h2>

                <p className="text-sm text-slate-500">
                  Regulatory Compliance Details
                </p>
              </div>

              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Status */}

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    selectedRecord.status
                  )}`}
                >
                  {selectedRecord.status}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(
                    selectedRecord.ndctCompliance
                  )}`}
                >
                  NDCT:{" "}
                  {selectedRecord.ndctCompliance}
                </span>
              </div>

              {/* Main Details */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DetailItem
                  label="Trial"
                  value={
                    selectedRecord.trialId
                  }
                />

                <DetailItem
                  label="Trial Title"
                  value={
                    selectedRecord.trialTitle
                  }
                />

                <DetailItem
                  label="Regulatory Authority"
                  value={
                    selectedRecord.authority
                  }
                />

                <DetailItem
                  label="Submission Type"
                  value={
                    selectedRecord.submissionType
                  }
                />

                <DetailItem
                  label="Reference Number"
                  value={
                    selectedRecord.referenceNumber
                  }
                />

                <DetailItem
                  label="Submission Date"
                  value={formatDisplayDate(
                    selectedRecord.submissionDate
                  )}
                />

                <DetailItem
                  label="Approval Date"
                  value={formatDisplayDate(
                    selectedRecord.approvalDate
                  )}
                />

                <DetailItem
                  label="Expiry Date"
                  value={formatDisplayDate(
                    selectedRecord.expiryDate
                  )}
                />
              </div>

              {/* Remarks */}

              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                  <CalendarDays
                    size={18}
                    className="text-blue-600"
                  />
                  Remarks
                </h3>

                <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {selectedRecord.remarks ||
                    "No remarks added."}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {value}
          </p>
        </div>

        <div
          className={`rounded-xl p-3 ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* =========================================================
   FORM SELECT
========================================================= */

function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  displayMap = {},
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {displayMap[option] || option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}