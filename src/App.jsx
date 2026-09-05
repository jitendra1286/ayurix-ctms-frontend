import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Dashboard from "./pages/Dashboard"
import ClinicalTrials from "./pages/ClinicalTrials"
import Participants from "./pages/Participants"
import Visits from "./pages/Visits"
import SitesInvestigators from "./pages/SitesInvestigators"
import EthicsCommittee from "./pages/EthicsCommittee"
import RegulatoryCompliance from "./pages/RegulatoryCompliance"
import Pharmacovigilance from "./pages/Pharmacovigilance"
import RFIDCheckIn from "./pages/RFIDCheckIn"
import Documents from "./pages/Documents"
import ReportsAnalytics from "./pages/ReportsAnalytics"
import AuditTrail from "./pages/AuditTrail"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="clinical-trials"
            element={<ClinicalTrials />}
          />

          <Route
            path="participants"
            element={<Participants />}
          />

          <Route
            path="visits"
            element={<Visits />}
          />

          <Route
            path="sites-investigators"
            element={<SitesInvestigators />}
          />

          <Route
            path="ethics"
            element={<EthicsCommittee />}
          />

          <Route
            path="regulatory"
            element={<RegulatoryCompliance />}
          />

          <Route
            path="pharmacovigilance"
            element={<Pharmacovigilance />}
          />

          <Route
            path="rfid-checkin"
            element={<RFIDCheckIn />}
          />

          <Route
            path="documents"
            element={<Documents />}
          />

          <Route
            path="reports-analytics"
            element={<ReportsAnalytics />}
          />

          <Route
            path="audit-trail"
            element={<AuditTrail />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App