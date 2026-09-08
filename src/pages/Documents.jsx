import { useEffect, useMemo, useState } from "react"
import {
  FileText,
  Upload,
  Search,
  Filter,
  Eye,
  Download,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle,
  FileCheck2,
  ShieldCheck,
  CalendarDays,
  UserRound,
  FolderOpen,
  Loader2,
  Trash2,
} from "lucide-react"

import api from "../services/api"


function StatusBadge({ status }) {
  const config = {
    Approved: {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    Verified: {
      className: "bg-blue-50 text-blue-700",
      icon: ShieldCheck,
    },
    "Pending Review": {
      className: "bg-amber-50 text-amber-700",
      icon: Clock3,
    },
    "Under Review": {
      className: "bg-purple-50 text-purple-700",
      icon: Clock3,
    },
    Draft: {
      className: "bg-slate-100 text-slate-600",
      icon: FileText,
    },
    Rejected: {
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  }

  const current = config[status] || config.Draft
  const Icon = current.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      <Icon size={13} />
      {status || "Draft"}
    </span>
  )
}


function CategoryBadge({ category }) {
  const colors = {
    "Trial Protocol": "bg-indigo-50 text-indigo-700",
    "Consent Form": "bg-blue-50 text-blue-700",
    Ethics: "bg-purple-50 text-purple-700",
    Regulatory: "bg-emerald-50 text-emerald-700",
    Investigator: "bg-amber-50 text-amber-700",
    Safety: "bg-red-50 text-red-700",
    Site: "bg-cyan-50 text-cyan-700",
    "Study Document": "bg-slate-100 text-slate-700",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        colors[category] || "bg-slate-100 text-slate-600"
      }`}
    >
      {category}
    </span>
  )
}


function Documents() {
  const [documents, setDocuments] = useState([])

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const [showUploadModal, setShowUploadModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [uploadForm, setUploadForm] = useState({
    documentName: "",
    category: "Trial Protocol",
    trialId: "",
    version: "v1.0",
    fileName: "",
    fileSize: "",
  })


  // =====================================================
  // FETCH DOCUMENTS
  // =====================================================

  const fetchDocuments = async () => {
    try {
      setLoading(true)

      const response = await api.get("/documents")

      setDocuments(response.data.documents || [])

    } catch (error) {
      console.error("Fetch Documents Error:", error)

      alert(
        error.response?.data?.message ||
          "Failed to load documents."
      )
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchDocuments()
  }, [])


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-"

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }


  // =====================================================
  // FORMAT SIZE
  // =====================================================

  const formatSize = (bytes) => {
    if (!bytes) return "-"

    const size = Number(bytes)

    if (size < 1024) {
      return `${size} B`
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }


  // =====================================================
  // FILTER DOCUMENTS
  // =====================================================

  const filteredDocuments = useMemo(() => {
    const value = search.toLowerCase()

    return documents.filter((document) => {
      const matchesSearch =
        String(document.document_code || "")
          .toLowerCase()
          .includes(value) ||
        String(document.document_name || "")
          .toLowerCase()
          .includes(value) ||
        String(document.file_name || "")
          .toLowerCase()
          .includes(value) ||
        String(document.category || "")
          .toLowerCase()
          .includes(value) ||
        String(document.protocol_number || "")
          .toLowerCase()
          .includes(value) ||
        String(document.trial_title || "")
          .toLowerCase()
          .includes(value) ||
        String(document.uploaded_by_name || "")
          .toLowerCase()
          .includes(value)

      const matchesCategory =
        categoryFilter === "All" ||
        document.category === categoryFilter

      const matchesStatus =
        statusFilter === "All" ||
        document.status === statusFilter

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      )
    })
  }, [
    documents,
    search,
    categoryFilter,
    statusFilter,
  ])


  // =====================================================
  // STATS
  // =====================================================

  const totalDocuments = documents.length

  const approvedDocuments = documents.filter(
    (document) =>
      document.status === "Approved" ||
      document.status === "Verified"
  ).length

  const pendingDocuments = documents.filter(
    (document) =>
      document.status === "Pending Review" ||
      document.status === "Under Review"
  ).length

  const rejectedDocuments = documents.filter(
    (document) =>
      document.status === "Rejected"
  ).length


  // =====================================================
  // CATEGORY COUNTS
  // =====================================================

  const trialProtocolCount = documents.filter(
    (document) =>
      document.category === "Trial Protocol"
  ).length

  const ethicsCount = documents.filter(
    (document) =>
      document.category === "Ethics" ||
      document.category === "Consent Form"
  ).length

  const regulatoryCount = documents.filter(
    (document) =>
      document.category === "Regulatory"
  ).length

  const safetyCount = documents.filter(
    (document) =>
      document.category === "Safety"
  ).length


  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setUploadForm((previous) => ({
      ...previous,
      fileName: file.name,
      fileSize: formatSize(file.size),
    }))
  }


  // =====================================================
  // UPLOAD DOCUMENT
  // =====================================================

  const handleUpload = async (event) => {
    event.preventDefault()

    if (!uploadForm.fileName) {
      alert("Please select a document file.")
      return
    }

    try {
      setUploading(true)

      const selectedTrialId =
        uploadForm.trialId.trim() === ""
          ? null
          : Number(uploadForm.trialId)

      if (
        selectedTrialId !== null &&
        Number.isNaN(selectedTrialId)
      ) {
        alert(
          "Trial ID must be a numeric database ID."
        )
        return
      }

      const response = await api.post("/documents", {
        document_name:
          uploadForm.documentName.trim(),

        file_name:
          uploadForm.fileName,

        category:
          uploadForm.category,

        trial_id:
          selectedTrialId,

        version:
          uploadForm.version.trim() || "v1.0",

        file_size:
          uploadForm.fileSize,

        file_path:
          null,

        status:
          "Draft",
      })

      alert(
        response.data.message ||
          "Document created successfully."
      )

      setUploadForm({
        documentName: "",
        category: "Trial Protocol",
        trialId: "",
        version: "v1.0",
        fileName: "",
        fileSize: "",
      })

      setShowUploadModal(false)

      await fetchDocuments()

    } catch (error) {
      console.error("Upload Document Error:", error)

      alert(
        error.response?.data?.message ||
          "Failed to create document."
      )
    } finally {
      setUploading(false)
    }
  }


  // =====================================================
  // DELETE DOCUMENT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await api.delete(
        `/documents/${id}`
      )

      alert(
        response.data.message ||
          "Document deleted successfully."
      )

      await fetchDocuments()

    } catch (error) {
      console.error("Delete Document Error:", error)

      alert(
        error.response?.data?.message ||
          "Failed to delete document."
      )
    }
  }


  // =====================================================
  // VIEW DOCUMENT
  // =====================================================

  const handleView = (document) => {
    if (document.file_path) {
      window.open(
        document.file_path,
        "_blank",
        "noopener,noreferrer"
      )

      return
    }

    alert(
      `Document: ${document.document_name}\n\nFile: ${document.file_name}\nVersion: ${document.version}\nStatus: ${document.status}`
    )
  }


  // =====================================================
  // DOWNLOAD DOCUMENT
  // =====================================================

  const handleDownload = (document) => {
    if (document.file_path) {
      const link = window.document.createElement("a")

      link.href = document.file_path
      link.download = document.file_name

      document.body.appendChild(link)

      link.click()

      link.remove()

      return
    }

    alert(
      "Actual file storage is not connected yet. The document metadata is stored successfully in MySQL."
    )
  }


  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <div className="flex items-center gap-2">

            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <FolderOpen size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Documents
            </h1>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Centralized management of clinical trial, ethics,
            regulatory, investigator and safety documents.
          </p>
        </div>


        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Upload size={18} />
          Upload Document
        </button>

      </div>


      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Documents
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalDocuments}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <FileText size={22} />
            </div>

          </div>

        </div>


        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Approved / Verified
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {approvedDocuments}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <FileCheck2 size={22} />
            </div>

          </div>

        </div>


        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Pending Review
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingDocuments}
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
                Rejected
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {rejectedDocuments}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <AlertTriangle size={22} />
            </div>

          </div>

        </div>

      </div>


      {/* DOCUMENT CATEGORIES */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div>
          <h2 className="font-semibold text-slate-900">
            Document Categories
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Organize important clinical trial documents by type.
          </p>
        </div>


        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              title: "Trial Protocol",
              count: trialProtocolCount,
              icon: FileText,
            },
            {
              title: "Ethics & Consent",
              count: ethicsCount,
              icon: ShieldCheck,
            },
            {
              title: "Regulatory",
              count: regulatoryCount,
              icon: FileCheck2,
            },
            {
              title: "Safety",
              count: safetyCount,
              icon: AlertTriangle,
            },
          ].map((item) => {

            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600">
                    <Icon size={18} />
                  </div>

                  <span className="text-xl font-bold text-slate-800">
                    {item.count}
                  </span>

                </div>

                <p className="mt-3 text-sm font-semibold text-slate-800">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Documents
                </p>

              </div>
            )
          })}

        </div>

      </div>


      {/* SEARCH / FILTER */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-3 lg:grid-cols-3">

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
              placeholder="Search documents, trial, uploader..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
            />

          </div>


          <div className="relative">

            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">
                All Categories
              </option>

              <option value="Trial Protocol">
                Trial Protocol
              </option>

              <option value="Consent Form">
                Consent Form
              </option>

              <option value="Ethics">
                Ethics
              </option>

              <option value="Regulatory">
                Regulatory
              </option>

              <option value="Investigator">
                Investigator
              </option>

              <option value="Safety">
                Safety
              </option>

              <option value="Site">
                Site
              </option>

              <option value="Study Document">
                Study Document
              </option>
            </select>

          </div>


          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Verified">
              Verified
            </option>

            <option value="Pending Review">
              Pending Review
            </option>

            <option value="Under Review">
              Under Review
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Rejected">
              Rejected
            </option>

          </select>

        </div>

      </div>


      {/* DOCUMENT TABLE */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="font-semibold text-slate-900">
            Clinical Trial Documents
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredDocuments.length} document(s) found
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[1350px] text-left">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Document
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trial
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Version
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Uploaded By
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-6 py-16 text-center"
                  >

                    <Loader2
                      size={32}
                      className="mx-auto animate-spin text-indigo-500"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading documents...
                    </p>

                  </td>

                </tr>

              ) : (

                filteredDocuments.map((document) => (

                  <tr
                    key={document.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                          <FileText size={19} />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            {document.document_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {document.file_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {document.file_size || "-"}
                          </p>

                        </div>

                      </div>

                    </td>


                    <td className="px-5 py-4">

                      <CategoryBadge
                        category={document.category}
                      />

                    </td>


                    <td className="max-w-[260px] px-5 py-4">

                      <p className="text-xs font-semibold text-blue-600">
                        {document.protocol_number ||
                          `TRIAL-${document.trial_id || "-"}`}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {document.trial_title ||
                          "No trial linked"}
                      </p>

                    </td>


                    <td className="px-5 py-4">

                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        {document.version || "v1.0"}
                      </span>

                    </td>


                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <UserRound size={14} />
                        </div>

                        <span className="text-sm font-medium text-slate-700">
                          {document.uploaded_by_name ||
                            "Unknown"}
                        </span>

                      </div>

                    </td>


                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <CalendarDays
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-sm text-slate-600">
                          {formatDate(
                            document.uploaded_at
                          )}
                        </span>

                      </div>

                    </td>


                    <td className="px-5 py-4">

                      <StatusBadge
                        status={document.status}
                      />

                    </td>


                    <td className="px-5 py-4">

                      <div className="flex items-center gap-1">

                        <button
                          title="View Document"
                          onClick={() =>
                            handleView(document)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Eye size={17} />
                        </button>


                        <button
                          title="Download Document"
                          onClick={() =>
                            handleDownload(document)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Download size={17} />
                        </button>


                        <button
                          title="Delete Document"
                          onClick={() =>
                            handleDelete(document.id)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>


                        <button
                          title="More Actions"
                          onClick={() =>
                            alert(
                              `Document Code: ${document.document_code}`
                            )
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>


        {!loading &&
          filteredDocuments.length === 0 && (

            <div className="px-6 py-16 text-center">

              <FileText
                size={40}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-3 font-semibold text-slate-900">
                No documents found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>

            </div>

          )}

      </div>


      {/* DOCUMENT CONTROL NOTE */}

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
            <ShieldCheck size={20} />
          </div>

          <div>

            <h3 className="font-semibold text-indigo-900">
              Document Control
            </h3>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              Each document maintains version,
              uploader information, review status and
              traceable document metadata. This supports
              controlled clinical trial documentation and
              auditability.
            </p>

          </div>

        </div>

      </div>


      {/* UPLOAD MODAL */}

      {showUploadModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>

                <h2 className="font-semibold text-slate-900">
                  Upload Document
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add a new clinical trial document.
                </p>

              </div>


              <button
                onClick={() =>
                  setShowUploadModal(false)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <XCircle size={20} />
              </button>

            </div>


            <form
              onSubmit={handleUpload}
              className="space-y-4 p-6"
            >

              {/* DOCUMENT NAME */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Document Name
                </label>

                <input
                  required
                  type="text"
                  value={uploadForm.documentName}
                  onChange={(event) =>
                    setUploadForm({
                      ...uploadForm,
                      documentName:
                        event.target.value,
                    })
                  }
                  placeholder="Example: Clinical Trial Protocol"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />

              </div>


              {/* CATEGORY */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={uploadForm.category}
                  onChange={(event) =>
                    setUploadForm({
                      ...uploadForm,
                      category:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                >

                  <option value="Trial Protocol">
                    Trial Protocol
                  </option>

                  <option value="Consent Form">
                    Consent Form
                  </option>

                  <option value="Ethics">
                    Ethics
                  </option>

                  <option value="Regulatory">
                    Regulatory
                  </option>

                  <option value="Investigator">
                    Investigator
                  </option>

                  <option value="Safety">
                    Safety
                  </option>

                  <option value="Site">
                    Site
                  </option>

                  <option value="Study Document">
                    Study Document
                  </option>

                </select>

              </div>


              {/* TRIAL ID */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Trial Database ID
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  value={uploadForm.trialId}
                  onChange={(event) =>
                    setUploadForm({
                      ...uploadForm,
                      trialId:
                        event.target.value,
                    })
                  }
                  placeholder="Example: 1"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Enter the MySQL trial ID, not TRIAL-001.
                </p>

              </div>


              {/* VERSION */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Version
                </label>

                <input
                  required
                  type="text"
                  value={uploadForm.version}
                  onChange={(event) =>
                    setUploadForm({
                      ...uploadForm,
                      version:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />

              </div>


              {/* FILE */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Select File
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 transition hover:border-indigo-300 hover:bg-indigo-50/40">

                  <Upload
                    size={28}
                    className="text-indigo-500"
                  />

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    Click to select document
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    PDF, DOCX, XLSX supported
                  </p>

                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                  />

                </label>


                {uploadForm.fileName && (

                  <div className="mt-2 rounded-lg bg-emerald-50 p-3">

                    <p className="text-xs font-semibold text-emerald-700">
                      Selected: {uploadForm.fileName}
                    </p>

                    <p className="mt-1 text-xs text-emerald-600">
                      Size: {uploadForm.fileSize}
                    </p>

                  </div>

                )}

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowUploadModal(false)
                  }
                  disabled={uploading}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {uploading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Upload
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Documents