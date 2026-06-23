import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@core/context/AuthContext"
import { LoginView } from "./views/LoginView"
import { DashboardView } from "./views/DashboardView"
import { KanbanView } from "./views/KanbanView"
import { CalendarView } from "./views/CalendarView"
import { ProjectView } from "./views/ProjectView"
import { GoalsView } from "./views/GoalsView"
import { NotesView } from "./views/NotesView"
import { FocusModeView } from "./views/FocusModeView"
import { SettingsView } from "./views/SettingsView"
import { Sidebar } from "./components/layout/Sidebar"

export const App = () => {
  const { token } = useAuth()

  if (!token) return <LoginView />

  return (
    <div className="app-root">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/kanban" element={<KanbanView />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/projects/:id" element={<ProjectView />} />
          <Route path="/goals" element={<GoalsView />} />
          <Route path="/notes" element={<NotesView />} />
          <Route path="/focus/:taskId" element={<FocusModeView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
