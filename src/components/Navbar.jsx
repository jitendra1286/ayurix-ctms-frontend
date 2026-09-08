import {
  Search,
  Bell,
  HelpCircle,
  Menu,
} from "lucide-react"

function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">

      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="hidden text-sm text-slate-500 sm:block">
            Clinical Research Management
          </p>

          <h2 className="truncate text-base font-bold text-slate-900 sm:text-xl">
            Ayurix Clinical Trials Dashboard
          </h2>
        </div>

      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search
            size={17}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-400 lg:w-48"
          />
        </div>

        {/* Mobile Search Icon */}
        <button
          className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Search"
        >
          <Search size={19} />
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2.5 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Help */}
        <button
          className="hidden rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 sm:block"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </button>

      </div>
    </header>
  )
}

export default Navbar