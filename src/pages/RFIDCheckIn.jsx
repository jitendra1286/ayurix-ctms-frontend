import { useMemo, useState } from "react"
import {
  Radio,
  Search,
  UserRound,
  Clock3,
  CheckCircle2,
  XCircle,
  Smartphone,
  MapPin,
  CalendarDays,
  ScanLine,
  ShieldCheck,
  Activity,
} from "lucide-react"

const checkInRecords = [
  {
    id: 1,
    rfidUid: "A37B921F",
    participantId: "P-1024",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    visit: "Visit 03",
    site: "AIIA New Delhi",
    device: "CTMS-DEVICE-01",
    checkInTime: "04 Sep 2026, 09:42 AM",
    status: "CHECKED_IN",
  },
  {
    id: 2,
    rfidUid: "B82C4A10",
    participantId: "P-1031",
    trialId: "TRIAL-002",
    trialTitle: "Ayurvedic Therapy for Chronic Arthritis",
    visit: "Visit 02",
    site: "AIIA Ahmedabad",
    device: "CTMS-DEVICE-02",
    checkInTime: "04 Sep 2026, 09:31 AM",
    status: "CHECKED_IN",
  },
  {
    id: 3,
    rfidUid: "C91D72AA",
    participantId: "P-1045",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    visit: "Visit 04",
    site: "AIIA New Delhi",
    device: "CTMS-DEVICE-01",
    checkInTime: "04 Sep 2026, 09:18 AM",
    status: "CHECKED_IN",
  },
  {
    id: 4,
    rfidUid: "D44E90BC",
    participantId: "P-1078",
    trialId: "TRIAL-003",
    trialTitle: "Herbal Support in Migraine Management",
    visit: "Visit 01",
    site: "AIIA Jaipur",
    device: "CTMS-DEVICE-03",
    checkInTime: "04 Sep 2026, 08:55 AM",
    status: "CHECKED_IN",
  },
  {
    id: 5,
    rfidUid: "INVALID001",
    participantId: "Unknown",
    trialId: "-",
    trialTitle: "No matching participant",
    visit: "-",
    site: "AIIA New Delhi",
    device: "CTMS-DEVICE-01",
    checkInTime: "04 Sep 2026, 08:41 AM",
    status: "BLOCKED",
  },
]

function StatusBadge({ status }) {
  if (status === "CHECKED_IN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        Checked In
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
      <XCircle size={13} />
      Blocked
    </span>
  )
}

function RFIDCheckIn() {
  const [rfidUid, setRfidUid] = useState("")
  const [search, setSearch] = useState("")
  const [scanResult, setScanResult] = useState(null)

  const filteredRecords = useMemo(() => {
    const value = search.toLowerCase()

    return checkInRecords.filter(
      (record) =>
        record.rfidUid.toLowerCase().includes(value) ||
        record.participantId.toLowerCase().includes(value) ||
        record.trialId.toLowerCase().includes(value) ||
        record.site.toLowerCase().includes(value)
    )
  }, [search])

  const totalCheckIns = checkInRecords.filter(
    (record) => record.status === "CHECKED_IN"
  ).length

  const blockedAttempts = checkInRecords.filter(
    (record) => record.status === "BLOCKED"
  ).length

  const activeDevices = 3

  const handleScan = () => {
    const uid = rfidUid.trim().toUpperCase()

    if (!uid) {
      setScanResult({
        type: "error",
        title: "RFID UID Required",
        message: "Please enter an RFID UID to simulate a card scan.",
      })
      return
    }

    const participant = checkInRecords.find(
      (record) => record.rfidUid === uid
    )

    if (!participant || participant.status === "BLOCKED") {
      setScanResult({
        type: "error",
        title: "Check-in Blocked",
        message:
          "No valid participant or scheduled visit was found for this RFID card.",
        uid,
      })
      return
    }

    setScanResult({
      type: "success",
      title: "Participant Checked In",
      message: "RFID successfully matched with participant record.",
      uid,
      participant,
    })
  }

  const simulateCard = (uid) => {
    setRfidUid(uid)
    setScanResult(null)
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Radio size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Smart RFID Check-in
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Quickly identify participants and record scheduled
            clinical trial visits using RFID-enabled check-in.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

          <span className="text-sm font-semibold text-emerald-700">
            RFID System Online
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Today's Check-ins
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalCheckIns}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Active RFID Devices
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {activeDevices}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <Smartphone size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Blocked Attempts
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {blockedAttempts}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <ShieldCheck size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                System Status
              </p>

              <p className="mt-2 text-lg font-bold text-emerald-600">
                Operational
              </p>
            </div>

            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <Activity size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* RFID SCANNER */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <ScanLine size={23} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                RFID Scanner
              </h2>

              <p className="text-xs text-slate-500">
                Simulate an RFID card scan
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
              <Radio size={38} />
            </div>

            <p className="mt-4 text-center text-sm font-semibold text-slate-800">
              Tap RFID card on reader
            </p>

            <p className="mt-1 text-center text-xs text-slate-500">
              In hardware mode, ESP32 + RC522 will automatically
              provide the UID.
            </p>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              RFID UID
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={rfidUid}
                onChange={(event) =>
                  setRfidUid(event.target.value)
                }
                placeholder="Example: A37B921F"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm uppercase outline-none transition focus:border-indigo-500 focus:bg-white"
              />

              <button
                onClick={handleScan}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <ScanLine size={17} />
                Scan
              </button>
            </div>
          </div>

          {/* DEMO BUTTONS */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-slate-500">
              Demo RFID cards
            </p>

            <div className="flex flex-wrap gap-2">
              {["A37B921F", "B82C4A10", "C91D72AA", "INVALID001"].map(
                (uid) => (
                  <button
                    key={uid}
                    onClick={() => simulateCard(uid)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {uid}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* SCAN RESULT */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Check-in Result
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Participant identification and visit validation result.
          </p>

          {!scanResult && (
            <div className="mt-6 flex min-h-[310px] flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
              <Radio
                size={42}
                className="text-slate-300"
              />

              <h3 className="mt-4 font-semibold text-slate-700">
                Waiting for RFID scan
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Scan a valid RFID card to identify the participant
                and display the scheduled visit.
              </p>
            </div>
          )}

          {scanResult?.type === "error" && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-red-600">
                  <XCircle size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-red-900">
                    {scanResult.title}
                  </h3>

                  <p className="mt-1 text-sm text-red-700">
                    {scanResult.message}
                  </p>

                  {scanResult.uid && (
                    <p className="mt-3 text-xs font-semibold text-red-600">
                      RFID UID: {scanResult.uid}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {scanResult?.type === "success" && (
            <div className="mt-6">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white p-2 text-emerald-600">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-emerald-900">
                      {scanResult.title}
                    </h3>

                    <p className="mt-1 text-sm text-emerald-700">
                      {scanResult.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    RFID UID
                  </span>

                  <span className="text-sm font-bold text-indigo-600">
                    {scanResult.uid}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Participant
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {scanResult.participant.participantId}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Trial
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {scanResult.participant.trialId}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Visit
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {scanResult.participant.visit}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Site
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {scanResult.participant.site}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <StatusBadge status="CHECKED_IN" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Smart Check-in Flow
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          RFID-based participant identification workflow.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {[
            {
              number: "01",
              title: "RFID Scan",
              text: "Participant taps RFID card.",
              icon: Radio,
            },
            {
              number: "02",
              title: "UID Read",
              text: "Reader captures unique UID.",
              icon: ScanLine,
            },
            {
              number: "03",
              title: "Participant Match",
              text: "Backend maps UID to participant.",
              icon: UserRound,
            },
            {
              number: "04",
              title: "Visit Validation",
              text: "System checks scheduled visit.",
              icon: CalendarDays,
            },
            {
              number: "05",
              title: "Check-in",
              text: "Visit is recorded with timestamp.",
              icon: CheckCircle2,
            },
          ].map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.number}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600">
                    <Icon size={18} />
                  </div>

                  <span className="text-xs font-bold text-indigo-500">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                  {step.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {step.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* SEARCH */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
            placeholder="Search RFID UID, participant, trial or site..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* CHECK-IN TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Recent Check-ins
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            RFID activity recorded across clinical trial sites.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  RFID UID
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Participant
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Visit
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Site
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Device
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Check-in Time
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">
                      {record.rfidUid}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserRound size={15} />
                      </div>

                      <span className="text-sm font-semibold text-slate-800">
                        {record.participantId}
                      </span>
                    </div>
                  </td>

                  <td className="max-w-[260px] px-5 py-4">
                    <p className="text-xs font-semibold text-blue-600">
                      {record.trialId}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {record.trialTitle}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {record.visit}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="text-sm text-slate-700">
                        {record.site}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Smartphone
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="text-xs font-medium text-slate-600">
                        {record.device}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Clock3
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="text-sm text-slate-700">
                        {record.checkInTime}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="px-6 py-14 text-center">
            <Radio
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No check-in records found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search term.
            </p>
          </div>
        )}
      </div>

      {/* SECURITY NOTE */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-indigo-900">
              Privacy & Safety
            </h3>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              RFID cards should contain only a non-sensitive unique
              identifier. Participant personal or clinical information
              should remain inside the secure CTMS database.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RFIDCheckIn