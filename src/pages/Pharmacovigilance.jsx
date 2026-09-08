import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  ShieldAlert,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  UserRound,
  CalendarDays,
  Eye,
  MoreHorizontal,
  HeartPulse,
  Siren,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import api from "../services/api";

function SeverityBadge({ severity }) {
  const config = {
    Mild: "bg-emerald-50 text-emerald-700",
    Moderate: "bg-amber-50 text-amber-700",
    Severe: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        config[severity] || "bg-slate-100 text-slate-600"
      }`}
    >
      {severity || "-"}
    </span>
  );
}

function SeriousnessBadge({ seriousness }) {
  const isSerious = seriousness === "Serious";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isSerious
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {isSerious && <Siren size={13} />}
      {seriousness || "-"}
    </span>
  );
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
  };

  const current =
    config[status] || config["Under Review"];

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      <Icon size={13} />
      {status || "Under Review"}
    </span>
  );
}

const emptyForm = {
  trial_id: "",
  participant_id: "",
  event_term: "",
  severity: "Mild",
  seriousness: "Non-Serious",
  onset_date: "",
  outcome: "Recovering",
  description: "",
};

function Pharmacovigilance() {
  const [adverseEvents, setAdverseEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [trials, setTrials] = useState([]);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [seriousnessFilter, setSeriousnessFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // FETCH DATA
  // --------------------------------------------------

  const fetchAdverseEvents = async () => {
    try {
      const response = await api.get("/adverse-events");

      setAdverseEvents(
        response.data.adverseEvents ||
          response.data.events ||
          []
      );
    } catch (err) {
      console.error(
        "Fetch Adverse Events Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load adverse events."
      );
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await api.get("/participants");

      setParticipants(
        response.data.participants || []
      );
    } catch (err) {
      console.error(
        "Fetch Participants Error:",
        err
      );
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
      fetchAdverseEvents(),
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

  const getParticipant = (id) => {
    return participants.find(
      (participant) =>
        Number(participant.id) === Number(id)
    );
  };

  const getTrial = (id) => {
    return trials.find(
      (trial) =>
        Number(trial.id) === Number(id)
    );
  };

  const getParticipantCode = (id) => {
    const participant = getParticipant(id);

    return (
      participant?.participant_code ||
      `P-${String(id).padStart(4, "0")}`
    );
  };

  const getParticipantName = (id) => {
    const participant = getParticipant(id);

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

  const getTrialName = (id) => {
    const trial = getTrial(id);

    return (
      trial?.title ||
      trial?.name ||
      `Trial #${id}`
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

  const getDateInputValue = (dateValue) => {
    if (!dateValue) return "";

    return String(dateValue).substring(0, 10);
  };

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const getEventStatus = (event) => {
    if (
      event.status
    ) {
      return event.status;
    }

    if (event.seriousness === "Serious") {
      return "SAE Review";
    }

    if (event.outcome === "Recovered") {
      return "Closed";
    }

    return "Under Review";
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredEvents = useMemo(() => {
    return adverseEvents.filter((event) => {
      const participantCode =
        getParticipantCode(
          event.participant_id
        );

      const participantName =
        getParticipantName(
          event.participant_id
        );

      const trialName =
        getTrialName(event.trial_id);

      const eventTerm =
        event.event_term || "";

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(event.id)
          .toLowerCase()
          .includes(searchText) ||
        participantCode
          .toLowerCase()
          .includes(searchText) ||
        participantName
          .toLowerCase()
          .includes(searchText) ||
        String(event.trial_id)
          .toLowerCase()
          .includes(searchText) ||
        trialName
          .toLowerCase()
          .includes(searchText) ||
        eventTerm
          .toLowerCase()
          .includes(searchText);

      const matchesSeverity =
        severityFilter === "All" ||
        event.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        getEventStatus(event) ===
          statusFilter;

      const matchesSeriousness =
        seriousnessFilter === "All" ||
        event.seriousness ===
          seriousnessFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus &&
        matchesSeriousness
      );
    });
  }, [
    adverseEvents,
    participants,
    trials,
    search,
    severityFilter,
    statusFilter,
    seriousnessFilter,
  ]);

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const totalEvents =
    adverseEvents.length;

  const seriousEvents =
    adverseEvents.filter(
      (event) =>
        event.seriousness === "Serious"
    ).length;

  const underReview =
    adverseEvents.filter(
      (event) =>
        getEventStatus(event) ===
        "Under Review"
    ).length;

  const resolvedEvents =
    adverseEvents.filter(
      (event) =>
        getEventStatus(event) ===
          "Closed" ||
        event.outcome === "Recovered"
    ).length;

  const severeEvents =
    adverseEvents.filter(
      (event) =>
        event.severity === "Severe"
    ).length;

  const mildEvents =
    adverseEvents.filter(
      (event) =>
        event.severity === "Mild"
    ).length;

  const moderateEvents =
    adverseEvents.filter(
      (event) =>
        event.severity === "Moderate"
    ).length;

  const saeReviewEvents =
    adverseEvents.filter(
      (event) =>
        getEventStatus(event) ===
        "SAE Review"
    ).length;

  const reportedEvents =
    adverseEvents.filter(
      (event) =>
        getEventStatus(event) ===
        "Reported"
    ).length;

  // --------------------------------------------------
  // MODAL
  // --------------------------------------------------

  const openCreateModal = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);

    setForm({
      trial_id: event.trial_id || "",
      participant_id:
        event.participant_id || "",
      event_term:
        event.event_term || "",
      severity:
        event.severity || "Mild",
      seriousness:
        event.seriousness ||
        "Non-Serious",
      onset_date:
        getDateInputValue(
          event.onset_date
        ),
      outcome:
        event.outcome ||
        "Recovering",
      description:
        event.description || "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingEvent(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } =
      event.target;

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
      setError(
        "Please select a clinical trial."
      );
      return;
    }

    if (!form.participant_id) {
      setError(
        "Please select a participant."
      );
      return;
    }

    if (!form.event_term.trim()) {
      setError(
        "Please enter adverse event."
      );
      return;
    }

    if (!form.onset_date) {
      setError(
        "Please select onset date."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        trial_id: Number(form.trial_id),
        participant_id:
          Number(form.participant_id),
        event_term:
          form.event_term.trim(),
        severity: form.severity,
        seriousness:
          form.seriousness,
        onset_date:
          form.onset_date,
        outcome:
          form.outcome,
        description:
          form.description.trim() ||
          null,
      };

      if (editingEvent) {
        await api.put(
          `/adverse-events/${editingEvent.id}`,
          payload
        );

        setSuccess(
          "Adverse event updated successfully."
        );
      } else {
        await api.post(
          "/adverse-events",
          payload
        );

        setSuccess(
          "Adverse event reported successfully."
        );
      }

      await fetchAdverseEvents();

      closeModal();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Save Adverse Event Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save adverse event."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this adverse event?"
      );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(
        `/adverse-events/${id}`
      );

      setAdverseEvents((previous) =>
        previous.filter(
          (event) =>
            Number(event.id) !==
            Number(id)
        )
      );

      setSuccess(
        "Adverse event deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Delete Adverse Event Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete adverse event."
      );
    }
  };

  // --------------------------------------------------
  // VIEW
  // --------------------------------------------------

  const handleView = (event) => {
    const participantName =
      getParticipantName(
        event.participant_id
      );

    const trialName =
      getTrialName(
        event.trial_id
      );

    window.alert(
      `Adverse Event Details\n\n` +
        `AE ID: AE-${String(
          event.id
        ).padStart(5, "0")}\n` +
        `Participant: ${participantName}\n` +
        `Trial: ${trialName}\n` +
        `Event: ${event.event_term}\n` +
        `Severity: ${event.severity}\n` +
        `Seriousness: ${event.seriousness}\n` +
        `Onset: ${formatDate(
          event.onset_date
        )}\n` +
        `Outcome: ${
          event.outcome || "-"
        }\n` +
        `Description: ${
          event.description ||
          "No description"
        }`
    );
  };

  return (
    <div className="space-y-6">

      {/* SUCCESS */}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && !showModal && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

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

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
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

            {[
              {
                label: "Mild",
                count: mildEvents,
                text: "text-emerald-600",
                bar: "bg-emerald-500",
              },
              {
                label: "Moderate",
                count: moderateEvents,
                text: "text-amber-600",
                bar: "bg-amber-500",
              },
              {
                label: "Severe",
                count: severeEvents,
                text: "text-red-600",
                bar: "bg-red-500",
              },
            ].map((item) => (
              <div key={item.label}>

                <div className="mb-2 flex justify-between text-sm">

                  <span className="font-medium text-slate-700">
                    {item.label}
                  </span>

                  <span
                    className={`font-semibold ${item.text}`}
                  >
                    {item.count}
                  </span>

                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full rounded-full ${item.bar}`}
                    style={{
                      width:
                        totalEvents > 0
                          ? `${
                              (item.count /
                                totalEvents) *
                              100
                            }%`
                          : "0%",
                    }}
                  />

                </div>

              </div>
            ))}

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
                {saeReviewEvents}
              </p>

            </div>

            <div className="rounded-lg bg-white p-4">

              <p className="text-xs text-slate-500">
                Reported
              </p>

              <p className="mt-1 text-2xl font-bold text-purple-600">
                {reportedEvents}
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
          Track an adverse event from initial reporting to final outcome.
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

            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-lg border border-slate-100 bg-slate-50 p-4"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-600">
                    <Icon size={18} />
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    {index + 1}. {step.title}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* SEARCH / FILTERS */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-3 lg:grid-cols-4">

          <div className="relative">

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

          {loading ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading adverse events...
              </p>

            </div>
          ) : (
            <table className="w-full min-w-[1400px] text-left">

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

                {filteredEvents.map((event) => {

                  const participantCode =
                    getParticipantCode(
                      event.participant_id
                    );

                  const participantName =
                    getParticipantName(
                      event.participant_id
                    );

                  const trialName =
                    getTrialName(
                      event.trial_id
                    );

                  return (
                    <tr
                      key={event.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* AE RECORD */}
                      <td className="px-5 py-4">

                        <p className="text-xs font-semibold text-red-600">
                          AE-
                          {String(event.id).padStart(
                            5,
                            "0"
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Reported{" "}
                          {formatDate(
                            event.reported_at
                          )}
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
                              {participantName}
                            </p>

                            <p className="text-xs text-slate-500">
                              {participantCode}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* TRIAL */}
                      <td className="max-w-[250px] px-5 py-4">

                        <p className="text-xs font-semibold text-blue-600">
                          TRIAL-
                          {String(
                            event.trial_id
                          ).padStart(3, "0")}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {trialName}
                        </p>

                      </td>

                      {/* EVENT */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-slate-800">
                          {event.event_term}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">

                          <CalendarDays size={12} />

                          Onset:{" "}
                          {formatDate(
                            event.onset_date
                          )}

                        </div>

                      </td>

                      {/* SEVERITY */}
                      <td className="px-5 py-4">
                        <SeverityBadge
                          severity={
                            event.severity
                          }
                        />
                      </td>

                      {/* SERIOUSNESS */}
                      <td className="px-5 py-4">
                        <SeriousnessBadge
                          seriousness={
                            event.seriousness
                          }
                        />
                      </td>

                      {/* OUTCOME */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {event.outcome ||
                            "-"}
                        </p>

                        <p className="mt-1 max-w-xs text-xs text-slate-400">
                          {event.description ||
                            "No description"}
                        </p>

                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <StatusBadge
                          status={getEventStatus(
                            event
                          )}
                        />

                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1">

                          <button
                            onClick={() =>
                              handleView(event)
                            }
                            title="View Adverse Event"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() =>
                              openEditModal(
                                event
                              )
                            }
                            title="Edit Adverse Event"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil
                              size={17}
                            />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                event.id
                              )
                            }
                            title="Delete Adverse Event"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                          <button
                            title="More Actions"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                          >
                            <MoreHorizontal
                              size={17}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          )}

        </div>

        {!loading &&
          filteredEvents.length === 0 && (
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

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  {editingEvent
                    ? "Edit Adverse Event"
                    : "Report Adverse Event"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Record participant safety information.
                </p>

              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
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

                {/* TRIAL */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Clinical Trial *
                  </label>

                  <select
                    name="trial_id"
                    value={form.trial_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
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

                {/* PARTICIPANT */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Participant *
                  </label>

                  <select
                    name="participant_id"
                    value={
                      form.participant_id
                    }
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  >

                    <option value="">
                      Select Participant
                    </option>

                    {participants.map(
                      (participant) => (
                        <option
                          key={
                            participant.id
                          }
                          value={
                            participant.id
                          }
                        >
                          {participant.participant_code ||
                            `Participant #${participant.id}`}
                        </option>
                      )
                    )}

                  </select>
                </div>

                {/* EVENT */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Adverse Event *
                  </label>

                  <input
                    type="text"
                    name="event_term"
                    value={
                      form.event_term
                    }
                    onChange={handleChange}
                    placeholder="e.g. Nausea, Headache, Skin Rash"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  />
                </div>

                {/* SEVERITY */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Severity *
                  </label>

                  <select
                    name="severity"
                    value={
                      form.severity
                    }
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  >

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
                </div>

                {/* SERIOUSNESS */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Seriousness *
                  </label>

                  <select
                    name="seriousness"
                    value={
                      form.seriousness
                    }
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  >

                    <option value="Non-Serious">
                      Non-Serious
                    </option>

                    <option value="Serious">
                      Serious
                    </option>

                  </select>
                </div>

                {/* ONSET DATE */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Onset Date *
                  </label>

                  <input
                    type="date"
                    name="onset_date"
                    value={
                      form.onset_date
                    }
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  />
                </div>

                {/* OUTCOME */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Outcome *
                  </label>

                  <select
                    name="outcome"
                    value={
                      form.outcome
                    }
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  >

                    <option value="Recovering">
                      Recovering
                    </option>

                    <option value="Recovered">
                      Recovered
                    </option>

                    <option value="Not Recovered">
                      Not Recovered
                    </option>

                    <option value="Fatal">
                      Fatal
                    </option>

                  </select>
                </div>

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the adverse event, clinical observations and relevant details..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
                />

              </div>

              {/* BUTTONS */}
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
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ShieldAlert
                        size={17}
                      />

                      {editingEvent
                        ? "Update Event"
                        : "Report Event"}
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

function ClipboardCheckIcon(props) {
  return <FileText {...props} />;
}

export default Pharmacovigilance;