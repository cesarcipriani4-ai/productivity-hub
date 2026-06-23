import { KanbanBoard } from "../components/kanban/KanbanBoard"

export const KanbanView = () => (
  <div className="view kanban-view">
    <div className="view-header">
      <h1>Tablero Kanban</h1>
    </div>
    <KanbanBoard />
  </div>
)
