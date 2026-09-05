import {
  Search,
  Bell,
  HelpCircle,
  Menu,
} from "lucide-react"

function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
          <Menu size={22} />
        </button>

        <div>
          <p className="text-sm text-slate-500">
            Clinical Research Management
          </p>

          <h2 className="text-xl font-bold text-slate-900">
            Ayurix Clinical Trials Dashboard
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button className="relative rounded-lg p-2.5 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100">
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  )
}

export default Navbar