import { useEffect, useState } from "react"
import type { Task } from "@core/models/Task"
import { syncService } from "@core/services/syncService"

export const TodayTasksWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    syncService.syncTasks().then(setTasks)
  }, [])

  return (
    <section className="card">
      <h2>Tareas de hoy</h2>
      <ul className="tasks-list">
        {tasks.length === 0 && (
          <li className="task-empty">Sin tareas pendientes</li>
        )}
        {tasks.slice(0, 5).map(task => (
          <li key={task.id} className={`task-item status-${task.status}`}>
            <div className="task-title">{task.title}</div>
            <div className="task-meta">
              <span className={`tag priority-${task.priority}`}>{task.priority}</span>
              {task.energy_level && (
                <span className={`tag energy-${task.energy_level}`}>{task.energy_level}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
