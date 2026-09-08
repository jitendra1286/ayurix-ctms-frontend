import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-64">

        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default MainLayout