import { TodayTasksWidget } from "../components/dashboard/TodayTasksWidget"
import { CalendarMiniWidget } from "../components/dashboard/CalendarMiniWidget"
import { GoalsSummaryWidget } from "../components/dashboard/GoalsSummaryWidget"
import { NotesQuickWidget } from "../components/dashboard/NotesQuickWidget"
import { FocusButton } from "../components/dashboard/FocusButton"

export const DashboardView = () => {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches"

  return (
    <div className="view dashboard-view">
      <div className="view-header">
        <h1>{greeting} 👋</h1>
        <span className="view-date">{new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>
      <div className="dashboard-grid">
        <TodayTasksWidget />
        <CalendarMiniWidget />
        <GoalsSummaryWidget />
        <NotesQuickWidget />
        <FocusButton />
      </div>
    </div>
  )
}
