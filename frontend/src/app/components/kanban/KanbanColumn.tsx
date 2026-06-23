import type { Task } from "@core/models/Task"
import { KanbanCard } from "./KanbanCard"

interface Props {
  status: string
  tasks: Task[]
  onTaskDrop: (taskId: string, newStatus: string) => void
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, changes: Partial<Task>) => void
}

const labels: Record<string, string> = {
  backlog: "Backlog",
  todo: "Por hacer",
  doing: "En progreso",
  done: "Hecho"
}

export const KanbanColumn = ({ status, tasks, onTaskDrop, onDelete, onUpdate }: Props) => {
  const handleDrop = (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData("taskId")
    onTaskDrop(taskId, status)
  }

  return (
    <div
      className="kanban-column"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <h2>{labels[status] ?? status}</h2>
        <span className="kanban-count">{tasks.length}</span>
      </div>
      <div className="kanban-column-body">
        {tasks.map(task => (
          <KanbanCard key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  )
}
