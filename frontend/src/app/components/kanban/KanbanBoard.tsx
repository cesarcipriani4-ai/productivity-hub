import { useEffect, useRef, useState } from "react"
import type { Task } from "@core/models/Task"
import { localStorageService } from "@core/services/localStorageService"
import { categoryService } from "@core/models/Category"
import { KanbanColumn } from "./KanbanColumn"

const COLUMNS = ["backlog", "todo", "doing", "done"] as const
const KEY = "tasks"

const DEMO: Task[] = [
  { id: "1", title: "Diseñar sistema de tareas", status: "doing", priority: "high", category_id: "work" },
  { id: "2", title: "Configurar base de datos", status: "todo", priority: "medium", category_id: "per" },
  { id: "3", title: "Crear endpoints REST", status: "backlog", priority: "low" },
]

export const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(() => localStorageService.load<Task[]>(KEY, DEMO))
  const [categories] = useState(() => categoryService.load())
  const titleRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const catRef = useRef<HTMLSelectElement>(null)

  useEffect(() => { localStorageService.save(KEY, tasks) }, [tasks])

  const addTask = () => {
    const title = titleRef.current?.value?.trim()
    if (!title) return
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: "todo",
      priority: "medium",
      due_date: dateRef.current?.value || undefined,
      category_id: catRef.current?.value || undefined
    }
    setTasks(prev => [newTask, ...prev])
    if (titleRef.current) titleRef.current.value = ""
    if (dateRef.current) dateRef.current.value = ""
    if (catRef.current) catRef.current.value = ""
  }

  const moveTask = (taskId: string, newStatus: string) =>
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))

  const deleteTask = (taskId: string) =>
    setTasks(prev => prev.filter(t => t.id !== taskId))

  const updateTask = (taskId: string, changes: Partial<Task>) =>
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...changes } : t))

  return (
    <div>
      <div className="kanban-add-row">
        <input ref={titleRef} className="kanban-input" type="text" placeholder="Nueva tarea..." onKeyDown={e => e.key === "Enter" && addTask()} />
        <select ref={catRef} className="kanban-input kanban-select">
          <option value="">Sin categoría</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input ref={dateRef} className="kanban-input kanban-date" type="date" title="Fecha límite" />
        <button className="btn-primary" onClick={addTask}>+ Agregar</button>
      </div>
      <div className="kanban-board">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col}
            status={col}
            tasks={tasks.filter(t => t.status === col)}
            onTaskDrop={moveTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        ))}
      </div>
    </div>
  )
}
