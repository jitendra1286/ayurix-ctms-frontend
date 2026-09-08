import { useEffect, useMemo, useState } from "react"
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

import api from "../services/api"

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

  const [checkInRecords, setCheckInRecords] = useState([])
  const [rfidCards, setRfidCards] = useState([])
  const [participants, setParticipants] = useState([])

  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)

  const [error, setError] = useState("")

  // ---------------------------------------
  // FETCH RFID DATA
  // ---------------------------------------
  const fetchRFIDData = async () => {
    try {
      setLoading(true)
      setError("")

      const [checkinsResponse, cardsResponse, participantsResponse] =
        await Promise.all([
          api.get("/rfid/checkins"),
          api.get("/rfid/cards"),
          api.get("/participants"),
        ])

      const checkins =
        checkinsResponse.data?.checkins ||
        checkinsResponse.data?.records ||
        []

      const cards =
        cardsResponse.data?.cards ||
        []

      const participantList =
        participantsResponse.data?.participants ||
        []

      setCheckInRecords(checkins)
      setRfidCards(cards)
      setParticipants(participantList)
    } catch (err) {
      console.error("RFID Data Error:", err)

      setError(
        err.response?.data?.message ||
          "Failed to load RFID data from backend."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRFIDData()
  }, [])

  // ---------------------------------------
  // PARTICIPANT MAP
  // ---------------------------------------
  const participantMap = useMemo(() => {
    const map = {}

    participants.forEach((participant) => {
      map[participant.id] = participant
    })

    return map
  }, [participants])

  // ---------------------------------------
  // FORMAT DATE
  // ---------------------------------------
  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-"

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // ---------------------------------------
  // FORMAT PARTICIPANT
  // ---------------------------------------
  const getParticipantCode = (participantId) => {
    const participant = participantMap[participantId]

    if (!participant) {
      return participantId ? `Participant #${participantId}` : "Unknown"
    }

    return (
      participant.participant_code ||
      participant.participantCode ||
      `Participant #${participant.id}`
    )
  }

  // ---------------------------------------
  // GET TRIAL / VISIT INFO
  // ---------------------------------------
  const getTrialId = (record) => {
    return record.trial_id || record.trialId || "-"
  }

  const getVisitName = (record) => {
    return (
      record.visit_name ||
      record.visitName ||
      record.visit_id ||
      "-"
    )
  }

  // ---------------------------------------
  // FILTER RECORDS
  // ---------------------------------------
  const filteredRecords = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return checkInRecords
    }

    return checkInRecords.filter((record) => {
      const uid = String(
        record.rfid_uid ||
          record.rfidUid ||
          ""
      ).toLowerCase()

      const participant = String(
        getParticipantCode(record.participant_id)
      ).toLowerCase()

      const trial = String(
        getTrialId(record)
      ).toLowerCase()

      const device = String(
        record.device_id ||
          record.device ||
          ""
      ).toLowerCase()

      return (
        uid.includes(value) ||
        participant.includes(value) ||
        trial.includes(value) ||
        device.includes(value)
      )
    })
  }, [search, checkInRecords, participantMap])

  // ---------------------------------------
  // STATS
  // ---------------------------------------
  const totalCheckIns = checkInRecords.filter(
    (record) =>
      String(record.status || "").toUpperCase() ===
      "CHECKED_IN"
  ).length

  const blockedAttempts = checkInRecords.filter(
    (record) =>
      String(record.status || "").toUpperCase() ===
      "BLOCKED"
  ).length

  const activeDevices = useMemo(() => {
    const devices = new Set()

    checkInRecords.forEach((record) => {
      const device =
        record.device_id ||
        record.device

      if (device) {
        devices.add(device)
      }
    })

    return devices.size
  }, [checkInRecords])

  // ---------------------------------------
  // RFID SCAN
  // ---------------------------------------
  const handleScan = async () => {
    const uid = rfidUid.trim().toUpperCase()

    if (!uid) {
      setScanResult({
        type: "error",
        title: "RFID UID Required",
        message:
          "Please enter an RFID UID to simulate a card scan.",
      })

      return
    }

    try {
      setScanning(true)
      setScanResult(null)
      setError("")

      /*
        Backend endpoint:
        POST /api/rfid/checkin

        Body:
        {
          rfid_uid: "A37B921F",
          device_id: "CTMS-DEVICE-01"
        }
      */

      const response = await api.post("/rfid/checkin", {
        rfid_uid: uid,
        device_id: "CTMS-DEVICE-01",
      })

      const data = response.data || {}

      if (data.success === false) {
        setScanResult({
          type: "error",
          title: "Check-in Blocked",
          message:
            data.message ||
            "No valid participant or scheduled visit was found.",
          uid,
        })

        await fetchRFIDData()

        return
      }

      const participantId =
        data.participant_id ||
        data.participantId ||
        data.checkin?.participant_id

      const trialId =
        data.trial_id ||
        data.trialId ||
        data.checkin?.trial_id

      const visitId =
        data.visit_id ||
        data.visitId ||
        data.checkin?.visit_id

      const card = rfidCards.find(
        (item) =>
          String(
            item.rfid_uid ||
              item.rfidUid ||
              ""
          ).toUpperCase() === uid
      )

      const participant =
        participantMap[participantId] ||
        participantMap[card?.participant_id]

      setScanResult({
        type: "success",
        title: "Participant Checked In",
        message:
          data.message ||
          "RFID successfully matched and check-in recorded.",
        uid,

        participant: {
          participantId:
            participant?.participant_code ||
            participant?.participantCode ||
            participantId ||
            "Unknown",

          trialId:
            trialId ||
            "Not assigned",

          visit:
            data.visit_name ||
            data.visitName ||
            visitId ||
            "Scheduled Visit",

          site:
            participant?.site_id
              ? `Site #${participant.site_id}`
              : "Clinical Trial Site",
        },
      })

      await fetchRFIDData()
    } catch (err) {
      console.error("RFID Check-in Error:", err)

      const message =
        err.response?.data?.message ||
        "RFID check-in failed. Please verify the RFID card."

      setScanResult({
        type: "error",
        title: "Check-in Blocked",
        message,
        uid,
      })

      await fetchRFIDData()
    } finally {
      setScanning(false)
    }
  }

  // ---------------------------------------
  // DEMO RFID BUTTON
  // ---------------------------------------
  const simulateCard = (uid) => {
    setRfidUid(uid)
    setScanResult(null)
  }

  // ---------------------------------------
  // REGISTERED RFID CARDS
  // ---------------------------------------
  const demoCards = useMemo(() => {
    const backendCards = rfidCards
      .map(
        (card) =>
          card.rfid_uid ||
          card.rfidUid
      )
      .filter(Boolean)

    if (backendCards.length > 0) {
      return backendCards.slice(0, 4)
    }

    return [
      "A37B921F",
      "B82C4A10",
      "C91D72AA",
      "INVALID001",
    ]
  }, [rfidCards])

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

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Today's Check-ins
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : totalCheckIns}
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
                {loading ? "..." : activeDevices}
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
                {loading ? "..." : blockedAttempts}
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
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleScan()
                  }
                }}
                placeholder="Example: A37B921F"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm uppercase outline-none transition focus:border-indigo-500 focus:bg-white"
              />

              <button
                onClick={handleScan}
                disabled={scanning}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ScanLine size={17} />

                {scanning ? "Checking..." : "Scan"}
              </button>
            </div>
          </div>

          {/* DEMO BUTTONS */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-slate-500">
              Demo RFID cards
            </p>

            <div className="flex flex-wrap gap-2">
              {demoCards.map((uid) => (
                <button
                  key={uid}
                  onClick={() => simulateCard(uid)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {uid}
                </button>
              ))}
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
            placeholder="Search RFID UID, participant, trial or device..."
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
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading RFID check-in records...
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const uid =
                    record.rfid_uid ||
                    record.rfidUid ||
                    "-"

                  const participantId =
                    record.participant_id ||
                    record.participantId

                  const trialId =
                    record.trial_id ||
                    record.trialId ||
                    "-"

                  const visit =
                    record.visit_name ||
                    record.visitName ||
                    record.visit_id ||
                    "-"

                  const device =
                    record.device_id ||
                    record.device ||
                    "-"

                  const status =
                    record.status || "CHECKED_IN"

                  return (
                    <tr
                      key={record.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">
                          {uid}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <UserRound size={15} />
                          </div>

                          <span className="text-sm font-semibold text-slate-800">
                            {getParticipantCode(participantId)}
                          </span>
                        </div>
                      </td>

                      <td className="max-w-[260px] px-5 py-4">
                        <p className="text-xs font-semibold text-blue-600">
                          {trialId}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          Clinical Trial
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />

                          <span className="text-sm font-medium text-slate-700">
                            {visit}
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
                            {participantMap[participantId]?.site_id
                              ? `Site #${participantMap[participantId].site_id}`
                              : "-"}
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
                            {device}
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
                            {formatDateTime(
                              record.checkin_time ||
                                record.checkInTime
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredRecords.length === 0 && (
          <div className="px-6 py-14 text-center">
            <Radio
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No check-in records found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search term or perform an RFID scan.
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