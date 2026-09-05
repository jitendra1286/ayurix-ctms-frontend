import { useMemo, useState } from "react"
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
} from "lucide-react"

const documents = [
  {
    id: "DOC-00125",
    name: "Clinical Trial Protocol",
    fileName: "TRIAL-001_Protocol_v2.1.pdf",
    category: "Trial Protocol",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    version: "v2.1",
    uploadedBy: "Dr. Meera Sharma",
    uploadedDate: "02 Sep 2026",
    size: "2.4 MB",
    status: "Approved",
  },
  {
    id: "DOC-00124",
    name: "Informed Consent Form",
    fileName: "TRIAL-001_ICF_v1.3.pdf",
    category: "Consent Form",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    version: "v1.3",
    uploadedBy: "Dr. Meera Sharma",
    uploadedDate: "01 Sep 2026",
    size: "1.8 MB",
    status: "Approved",
  },
  {
    id: "DOC-00123",
    name: "Ethics Committee Approval",
    fileName: "EC_Approval_TRIAL-002.pdf",
    category: "Ethics",
    trialId: "TRIAL-002",
    trialTitle: "Ayurvedic Therapy for Chronic Arthritis",
    version: "v1.0",
    uploadedBy: "Dr. Rajesh Patel",
    uploadedDate: "31 Aug 2026",
    size: "980 KB",
    status: "Approved",
  },
  {
    id: "DOC-00122",
    name: "CTRI Registration Certificate",
    fileName: "CTRI_TRIAL-003_Certificate.pdf",
    category: "Regulatory",
    trialId: "TRIAL-003",
    trialTitle: "Herbal Support in Migraine Management",
    version: "v1.0",
    uploadedBy: "Regulatory Team",
    uploadedDate: "29 Aug 2026",
    size: "750 KB",
    status: "Verified",
  },
  {
    id: "DOC-00121",
    name: "Investigator CV",
    fileName: "Dr_Kavita_Singh_CV.pdf",
    category: "Investigator",
    trialId: "TRIAL-003",
    trialTitle: "Herbal Support in Migraine Management",
    version: "v2.0",
    uploadedBy: "Dr. Kavita Singh",
    uploadedDate: "28 Aug 2026",
    size: "620 KB",
    status: "Pending Review",
  },
  {
    id: "DOC-00120",
    name: "Serious Adverse Event Report",
    fileName: "SAE_AE-00123_Report.pdf",
    category: "Safety",
    trialId: "TRIAL-001",
    trialTitle: "Ayurvedic Intervention for Type 2 Diabetes",
    version: "v1.1",
    uploadedBy: "Dr. Meera Sharma",
    uploadedDate: "27 Aug 2026",
    size: "1.2 MB",
    status: "Under Review",
  },
  {
    id: "DOC-00119",
    name: "Site Initiation Report",
    fileName: "SIR_AIIA_Bhopal.pdf",
    category: "Site",
    trialId: "TRIAL-004",
    trialTitle: "Ayurvedic Formulation for Skin Disorders",
    version: "v1.0",
    uploadedBy: "Dr. Amit Joshi",
    uploadedDate: "25 Aug 2026",
    size: "890 KB",
    status: "Approved",
  },
  {
    id: "DOC-00118",
    name: "Statistical Analysis Plan",
    fileName: "TRIAL-005_SAP_v1.0.pdf",
    category: "Study Document",
    trialId: "TRIAL-005",
    trialTitle: "Ayurvedic Lifestyle Intervention Study",
    version: "v1.0",
    uploadedBy: "Research Team",
    uploadedDate: "23 Aug 2026",
    size: "1.5 MB",
    status: "Draft",
  },
  {
    id: "DOC-00117",
    name: "Pharmacovigilance Report",
    fileName: "PV_Report_TRIAL-006.pdf",
    category: "Safety",
    trialId: "TRIAL-006",
    trialTitle: "Ayurvedic Treatment for Sleep Disorders",
    version: "v1.2",
    uploadedBy: "Dr. Suresh Mehta",
    uploadedDate: "22 Aug 2026",
    size: "1.1 MB",
    status: "Rejected",
  },
]

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
      {status}
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
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const [showUploadModal, setShowUploadModal] = useState(false)

  const [uploadForm, setUploadForm] = useState({
    documentName: "",
    category: "Trial Protocol",
    trialId: "",
    version: "v1.0",
    fileName: "",
  })

  const filteredDocuments = useMemo(() => {
    const value = search.toLowerCase()

    return documents.filter((document) => {
      const matchesSearch =
        document.id.toLowerCase().includes(value) ||
        document.name.toLowerCase().includes(value) ||
        document.fileName.toLowerCase().includes(value) ||
        document.category.toLowerCase().includes(value) ||
        document.trialId.toLowerCase().includes(value) ||
        document.trialTitle.toLowerCase().includes(value) ||
        document.uploadedBy.toLowerCase().includes(value)

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
  }, [search, categoryFilter, statusFilter])

  const totalDocuments = documents.length

  const approvedDocuments = documents.filter(
    (document) => document.status === "Approved"
  ).length

  const pendingDocuments = documents.filter(
    (document) =>
      document.status === "Pending Review" ||
      document.status === "Under Review"
  ).length

  const rejectedDocuments = documents.filter(
    (document) => document.status === "Rejected"
  ).length

  const handleUpload = (event) => {
    event.preventDefault()

    alert(
      `Document "${uploadForm.documentName}" uploaded successfully in demo mode.`
    )

    setUploadForm({
      documentName: "",
      category: "Trial Protocol",
      trialId: "",
      version: "v1.0",
      fileName: "",
    })

    setShowUploadModal(false)
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
                {approvedDocuments + 1}
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
              count: 1,
              icon: FileText,
            },
            {
              title: "Ethics & Consent",
              count: 2,
              icon: ShieldCheck,
            },
            {
              title: "Regulatory",
              count: 1,
              icon: FileCheck2,
            },
            {
              title: "Safety",
              count: 2,
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
              <option value="All">All Categories</option>
              <option value="Trial Protocol">
                Trial Protocol
              </option>
              <option value="Consent Form">
                Consent Form
              </option>
              <option value="Ethics">Ethics</option>
              <option value="Regulatory">Regulatory</option>
              <option value="Investigator">
                Investigator
              </option>
              <option value="Safety">Safety</option>
              <option value="Site">Site</option>
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
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">
              Pending Review
            </option>
            <option value="Under Review">
              Under Review
            </option>
            <option value="Draft">Draft</option>
            <option value="Rejected">Rejected</option>
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
              {filteredDocuments.map((document) => (
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
                          {document.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {document.fileName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {document.size}
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
                      {document.trialId}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {document.trialTitle}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                      {document.version}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserRound size={14} />
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {document.uploadedBy}
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
                        {document.uploadedDate}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={document.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        title="View Document"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Download Document"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <Download size={17} />
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
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
              Each document can maintain version history, uploader
              information, review status and traceable document
              metadata. This supports controlled clinical trial
              documentation and auditability.
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
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpload}
              className="space-y-4 p-6"
            >
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
                      documentName: event.target.value,
                    })
                  }
                  placeholder="Example: Clinical Trial Protocol"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={uploadForm.category}
                  onChange={(event) =>
                    setUploadForm({
                      ...uploadForm,
                      category: event.target.value,
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
                  <option value="Ethics">Ethics</option>
                  <option value="Regulatory">
                    Regulatory
                  </option>
                  <option value="Investigator">
                    Investigator
                  </option>
                  <option value="Safety">Safety</option>
                  <option value="Site">Site</option>
                  <option value="Study Document">
                    Study Document
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Trial ID
                </label>

                <input
                  required
                  type="text"
                  value={uploadForm.trialId}
                  onChange={(event) =>
                    setUploadForm({
                      ...uploadForm,
                      trialId: event.target.value,
                    })
                  }
                  placeholder="Example: TRIAL-001"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-indigo-500"
                />
              </div>

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
                      version: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

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
                    onChange={(event) =>
                      setUploadForm({
                        ...uploadForm,
                        fileName:
                          event.target.files?.[0]?.name || "",
                      })
                    }
                  />
                </label>

                {uploadForm.fileName && (
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    Selected: {uploadForm.fileName}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Upload size={17} />
                  Upload
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