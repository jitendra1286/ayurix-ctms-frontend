
import { useEffect, useMemo, useState } from "react"
import {
  Search,
  Plus,
  MapPin,
  Users,
  UserRound,
  Building2,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  XCircle,
  X,
  Edit,
  Trash2,
  Mail,
  Phone,
} from "lucide-react"

import api from "../services/api"

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "").toUpperCase()

  const config = {
    ACTIVE: {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    RECRUITING: {
      label: "Recruiting",
      className: "bg-blue-50 text-blue-700",
      icon: Users,
    },
    PENDING: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700",
      icon: Clock3,
    },
    INACTIVE: {
      label: "Inactive",
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  }

  const current = config[normalizedStatus] || config.PENDING
  const Icon = current.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      <Icon size={13} />
      {current.label}
    </span>
  )
}

function SitesInvestigators() {
  const [sites, setSites] = useState([])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const [selectedSite, setSelectedSite] = useState(null)

  const [openMenu, setOpenMenu] = useState(null)

  const [formData, setFormData] = useState({
    site_code: "",
    site_name: "",
    city: "",
    state: "",
    country: "India",
    status: "ACTIVE",
  })

  const [saving, setSaving] = useState(false)

  // ---------------------------------------------------------
  // FETCH SITES
  // ---------------------------------------------------------

  const fetchSites = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/sites")

      const data = response.data

      if (Array.isArray(data)) {
        setSites(data)
      } else if (Array.isArray(data.sites)) {
        setSites(data.sites)
      } else {
        setSites([])
      }
    } catch (err) {
      console.error("Fetch Sites Error:", err)

      setError(
        err.response?.data?.message ||
          "Failed to load sites. Please check the backend."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSites()
  }, [])

  // ---------------------------------------------------------
  // NORMALIZE SITE DATA
  // ---------------------------------------------------------

  const normalizedSites = useMemo(() => {
    return sites.map((site) => {
      const participants = Number(site.participants || 0)
      const target = Number(site.target || 0)

      let progress = 0

      if (target > 0) {
        progress = Math.min((participants / target) * 100, 100)
      }

      return {
        ...site,

        id: site.id,

        siteCode:
          site.site_code ||
          site.siteCode ||
          `SITE-${String(site.id).padStart(3, "0")}`,

        siteName:
          site.site_name ||
          site.siteName ||
          "Unnamed Site",

        location:
          site.location ||
          [site.city, site.state, site.country]
            .filter(Boolean)
            .join(", "),

        investigator:
          site.investigator ||
          site.investigator_name ||
          "Not Assigned",

        designation:
          site.designation ||
          site.investigator_qualification ||
          site.qualification ||
          "Site Investigator",

        email:
          site.investigator_email ||
          site.email ||
          "",

        phone:
          site.investigator_phone ||
          site.phone ||
          "",

        trials: Number(site.trials || 0),

        participants,

        target,

        progress,

        status: String(site.status || "ACTIVE").toUpperCase(),

        investigators: Number(site.investigators || 0),

        investigatorList:
          site.investigator_list ||
          site.investigators_list ||
          [],
      }
    })
  }, [sites])

  // ---------------------------------------------------------
  // FILTER
  // ---------------------------------------------------------

  const filteredSites = useMemo(() => {
    return normalizedSites.filter((site) => {
      const searchText = search.toLowerCase().trim()

      const matchesSearch =
        !searchText ||
        String(site.siteCode)
          .toLowerCase()
          .includes(searchText) ||
        String(site.siteName)
          .toLowerCase()
          .includes(searchText) ||
        String(site.location)
          .toLowerCase()
          .includes(searchText) ||
        String(site.investigator)
          .toLowerCase()
          .includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        site.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [normalizedSites, search, statusFilter])

  // ---------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------

  const totalSites = normalizedSites.length

  const activeSites = normalizedSites.filter(
    (site) => site.status === "ACTIVE"
  ).length

  const recruitingSites = normalizedSites.filter(
    (site) => site.status === "RECRUITING"
  ).length

  const totalInvestigators = normalizedSites.reduce(
    (sum, site) => {
      return sum + Number(site.investigators || 0)
    },
    0
  )

  const totalParticipants = normalizedSites.reduce(
    (sum, site) => {
      return sum + Number(site.participants || 0)
    },
    0
  )

  // ---------------------------------------------------------
  // FORM CHANGE
  // ---------------------------------------------------------

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // ---------------------------------------------------------
  // RESET FORM
  // ---------------------------------------------------------

  const resetForm = () => {
    setFormData({
      site_code: "",
      site_name: "",
      city: "",
      state: "",
      country: "India",
      status: "ACTIVE",
    })
  }

  // ---------------------------------------------------------
  // ADD SITE
  // ---------------------------------------------------------

  const handleAddSite = async (event) => {
    event.preventDefault()

    if (!formData.site_code.trim()) {
      alert("Site code is required.")
      return
    }

    if (!formData.site_name.trim()) {
      alert("Site name is required.")
      return
    }

    try {
      setSaving(true)

      const response = await api.post("/sites", {
        site_code: formData.site_code.trim(),
        site_name: formData.site_name.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim() || "India",
        status: formData.status,
      })

      alert(
        response.data?.message ||
          "Site created successfully."
      )

      setShowAddModal(false)
      resetForm()

      await fetchSites()
    } catch (err) {
      console.error("Add Site Error:", err)

      alert(
        err.response?.data?.message ||
          "Failed to create site."
      )
    } finally {
      setSaving(false)
    }
  }

  // ---------------------------------------------------------
  // EDIT SITE
  // ---------------------------------------------------------

  const openEditModal = (site) => {
    setSelectedSite(site)

    setFormData({
      site_code: site.siteCode || "",
      site_name: site.siteName || "",
      city: site.city || "",
      state: site.state || "",
      country: site.country || "India",
      status:
        site.status === "INACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
    })

    setOpenMenu(null)
    setShowEditModal(true)
  }

  const handleUpdateSite = async (event) => {
    event.preventDefault()

    if (!selectedSite) {
      return
    }

    if (!formData.site_code.trim()) {
      alert("Site code is required.")
      return
    }

    if (!formData.site_name.trim()) {
      alert("Site name is required.")
      return
    }

    try {
      setSaving(true)

      const response = await api.put(
        `/sites/${selectedSite.id}`,
        {
          site_code: formData.site_code.trim(),
          site_name: formData.site_name.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim() || "India",
          status: formData.status,
        }
      )

      alert(
        response.data?.message ||
          "Site updated successfully."
      )

      setShowEditModal(false)
      setSelectedSite(null)
      resetForm()

      await fetchSites()
    } catch (err) {
      console.error("Update Site Error:", err)

      alert(
        err.response?.data?.message ||
          "Failed to update site."
      )
    } finally {
      setSaving(false)
    }
  }

  // ---------------------------------------------------------
  // DELETE SITE
  // ---------------------------------------------------------

  const handleDeleteSite = async (site) => {
    setOpenMenu(null)

    const confirmed = window.confirm(
      `Are you sure you want to delete "${site.siteName}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await api.delete(
        `/sites/${site.id}`
      )

      alert(
        response.data?.message ||
          "Site deleted successfully."
      )

      await fetchSites()
    } catch (err) {
      console.error("Delete Site Error:", err)

      alert(
        err.response?.data?.message ||
          "Failed to delete site."
      )
    }
  }

  // ---------------------------------------------------------
  // VIEW SITE
  // ---------------------------------------------------------

  const handleViewSite = async (site) => {
    try {
      setOpenMenu(null)

      const response = await api.get(
        `/sites/${site.id}`
      )

      const data = response.data

      setSelectedSite(
        data.site ||
          data ||
          site
      )

      setShowViewModal(true)
    } catch (err) {
      console.error("View Site Error:", err)

      setSelectedSite(site)
      setShowViewModal(true)
    }
  }

  // ---------------------------------------------------------
  // RECRUITMENT OVERVIEW
  // ---------------------------------------------------------

  const recruitmentSites = normalizedSites.slice(0, 6)

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div
      className="space-y-6"
      onClick={() => setOpenMenu(null)}
    >
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Building2 size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Sites & Investigators
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage clinical trial sites, investigators and recruitment
            performance.
          </p>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation()
            resetForm()
            setShowAddModal(true)
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Site
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">
            Unable to load sites
          </p>

          <p className="mt-1">
            {error}
          </p>

          <button
            onClick={fetchSites}
            className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Sites
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalSites}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Building2 size={22} />
            </div>
          </div>
        </div>

        {/* ACTIVE */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Active Sites
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {activeSites}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* INVESTIGATORS */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Investigators
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {totalInvestigators}
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <UserRound size={22} />
            </div>
          </div>
        </div>

        {/* PARTICIPANTS */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Participants Enrolled
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {totalParticipants}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* RECRUITMENT OVERVIEW */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">
              Site Recruitment Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Participant enrollment performance by research site.
            </p>
          </div>

          <span className="text-sm font-medium text-blue-600">
            {recruitingSites} sites currently recruiting
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading recruitment data...
          </div>
        ) : recruitmentSites.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No site data available.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recruitmentSites.map((site) => (
              <div
                key={site.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {site.siteName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {site.location || "Location not available"}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(site.progress)}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${site.progress}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>
                    {site.participants} enrolled
                  </span>

                  <span>
                    {site.target > 0
                      ? `Target ${site.target}`
                      : "Target N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILTERS */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
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
              placeholder="Search site, location or investigator..."
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

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Research Sites
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Loading..."
                : `${filteredSites.length} site(s) found`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Site
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Investigator
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trials
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Participants
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Recruitment
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
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    Loading sites...
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => (
                  <tr
                    key={site.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* SITE */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Building2 size={19} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-blue-600">
                            {site.siteCode}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {site.siteName}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={12} />

                            {site.location ||
                              "Location not available"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* INVESTIGATOR */}

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {site.investigator}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {site.designation}
                      </p>

                      {site.email && (
                        <p className="mt-1 text-xs text-blue-600">
                          {site.email}
                        </p>
                      )}
                    </td>

                    {/* TRIALS */}

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                        {site.trials}
                      </span>
                    </td>

                    {/* PARTICIPANTS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Users
                          size={16}
                          className="text-slate-400"
                        />

                        <span className="text-sm font-semibold text-slate-800">
                          {site.participants}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {site.target > 0
                          ? `Target ${site.target}`
                          : "Target not set"}
                      </p>
                    </td>

                    {/* RECRUITMENT */}

                    <td className="px-5 py-4">
                      <div className="w-32">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-medium text-slate-600">
                            {Math.round(site.progress)}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${site.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={site.status}
                      />
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">
                      <div className="relative flex items-center gap-1">
                        <button
                          title="View Site"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleViewSite(site)
                          }}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="More Actions"
                          onClick={(event) => {
                            event.stopPropagation()

                            setOpenMenu(
                              openMenu === site.id
                                ? null
                                : site.id
                            )
                          }}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {openMenu === site.id && (
                          <div
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                            className="absolute right-0 top-10 z-20 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                          >
                            <button
                              onClick={() =>
                                handleViewSite(site)
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Eye size={15} />
                              View
                            </button>

                            <button
                              onClick={() =>
                                openEditModal(site)
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Edit size={15} />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteSite(site)
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}

        {!loading &&
          filteredSites.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Building2
                size={40}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-3 font-semibold text-slate-900">
                No sites found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          )}
      </div>

      {/* INVESTIGATOR INFO */}

      <div className="flex flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-800 sm:flex-row sm:items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-purple-600">
          <UserRound size={19} />
        </div>

        <div>
          <p className="font-semibold">
            Investigator Management
          </p>

          <p className="mt-1 text-xs text-purple-700">
            Principal Investigators and Site Investigators can be assigned
            to clinical trials and monitored for site-level performance.
          </p>
        </div>
      </div>

      {/* =====================================================
          ADD SITE MODAL
      ===================================================== */}

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!saving) {
              setShowAddModal(false)
            }
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add Research Site
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a new clinical trial research site.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleAddSite}
              className="space-y-4 p-6"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Site Code *
                </label>

                <input
                  name="site_code"
                  value={formData.site_code}
                  onChange={handleFormChange}
                  placeholder="SITE-008"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Site Name *
                </label>

                <input
                  name="site_name"
                  value={formData.site_name}
                  onChange={handleFormChange}
                  placeholder="AIIA Indore"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    City
                  </label>

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="Indore"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    State
                  </label>

                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    placeholder="Madhya Pradesh"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Country
                  </label>

                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Create Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT SITE MODAL
      ===================================================== */}

      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!saving) {
              setShowEditModal(false)
            }
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Edit Research Site
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Update site information.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateSite}
              className="space-y-4 p-6"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Site Code *
                </label>

                <input
                  name="site_code"
                  value={formData.site_code}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Site Name *
                </label>

                <input
                  name="site_name"
                  value={formData.site_name}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    City
                  </label>

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    State
                  </label>

                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Country
                  </label>

                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving
                    ? "Updating..."
                    : "Update Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW SITE MODAL
      ===================================================== */}

      {showViewModal && selectedSite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setShowViewModal(false)
          }
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold text-blue-600">
                  {selectedSite.site_code ||
                    selectedSite.siteCode ||
                    `SITE-${String(
                      selectedSite.id
                    ).padStart(3, "0")}`}
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {selectedSite.site_name ||
                    selectedSite.siteName}
                </h2>
              </div>

              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* SITE DETAILS */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    Site Information
                  </h3>

                  <StatusBadge
                    status={
                      selectedSite.status ||
                      "ACTIVE"
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">
                      Site Code
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedSite.site_code ||
                        selectedSite.siteCode ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Site Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedSite.site_name ||
                        selectedSite.siteName ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Location
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
                      <MapPin size={14} />
                      {selectedSite.location ||
                        [
                          selectedSite.city,
                          selectedSite.state,
                          selectedSite.country,
                        ]
                          .filter(Boolean)
                          .join(", ") ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Participants
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
                      <Users size={14} />
                      {selectedSite.participants ??
                        0}
                    </p>
                  </div>
                </div>
              </div>

              {/* INVESTIGATORS */}

              <div>
                <h3 className="mb-3 font-semibold text-slate-900">
                  Investigators
                </h3>

                {Array.isArray(
                  selectedSite.investigators
                ) ? (
                  selectedSite.investigators.length ===
                  0 ? (
                    <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500">
                      No investigators assigned.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedSite.investigators.map(
                        (investigator) => (
                          <div
                            key={
                              investigator.id
                            }
                            className="rounded-lg border border-slate-200 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {
                                    investigator.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {investigator.qualification ||
                                    "Site Investigator"}
                                </p>
                              </div>

                              <StatusBadge
                                status={
                                  investigator.status
                                }
                              />
                            </div>

                            {investigator.email && (
                              <p className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                                <Mail size={14} />
                                {
                                  investigator.email
                                }
                              </p>
                            )}

                            {investigator.phone && (
                              <p className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                                <Phone size={14} />
                                {
                                  investigator.phone
                                }
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )
                ) : (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedSite.investigator ||
                        selectedSite.investigator_name ||
                        "No investigator assigned"}
                    </p>

                    {(selectedSite.investigator_email ||
                      selectedSite.email) && (
                      <p className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={14} />
                        {selectedSite.investigator_email ||
                          selectedSite.email}
                      </p>
                    )}

                    {(selectedSite.investigator_phone ||
                      selectedSite.phone) && (
                      <p className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={14} />
                        {selectedSite.investigator_phone ||
                          selectedSite.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() =>
                    setShowViewModal(false)
                  }
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SitesInvestigators