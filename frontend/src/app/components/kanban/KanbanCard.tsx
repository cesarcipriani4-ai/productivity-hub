import { useRef, useState } from "react"
import type { Task } from "@core/models/Task"
import { categoryService } from "@core/models/Category"

interface Props {
  task: Task
  onDelete: (id: string) => void
  onUpdate: (id: string, changes: Partial<Task>) => void
}

const PRIORITIES = ["low", "medium", "high"] as const
const PRIORITY_ES: Record<string, string> = { low: "Baja", medium: "Media", high: "Alta" }

export const KanbanCard = ({ task, onDelete, onUpdate }: Props) => {
  const [editingDate, setEditingDate] = useState(false)
  const [editingCat, setEditingCat] = useState(false)
  const dateRef = useRef<HTMLInputElement>(null)
  const categories = categoryService.load()
  const category = categories.find(c => c.id === task.category_id)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id)
  }

  const cyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation()
    const idx = PRIORITIES.indexOf(task.priority as typeof PRIORITIES[number])
    onUpdate(task.id, { priority: PRIORITIES[(idx + 1) % PRIORITIES.length] })
  }

  const saveDate = () => {
    onUpdate(task.id, { due_date: dateRef.current?.value || undefined })
    setEditingDate(false)
  }

  const formatDate = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es", { day: "numeric", month: "short" })

  const isOverdue = task.due_date && new Date(task.due_date + "T23:59:59") < new Date()

  return (
    <div className="kanban-card" draggable onDragStart={handleDragStart}>
      <div className="kanban-card-top">
        <div className="kanban-card-title">{task.title}</div>
        <button className="kanban-card-delete" onClick={e => { e.stopPropagation(); onDelete(task.id) }} title="Eliminar">×</button>
      </div>

      {/* Categoría */}
      {!editingCat ? (
        <div
          className="kanban-category"
          style={{ borderLeftColor: category?.color ?? "var(--border)" }}
          onClick={e => { e.stopPropagation(); setEditingCat(true) }}
          title="Cambiar categoría"
        >
          <span className="kanban-cat-dot" style={{ background: category?.color ?? "var(--text-muted)" }} />
          <span className="kanban-cat-name">{category?.name ?? "Sin categoría"}</span>
        </div>
      ) : (
        <select
          className="kanban-date-input"
          style={{ width: "100%", marginBottom: 4 }}
          defaultValue={task.category_id ?? ""}
          autoFocus
          onBlur={e => { onUpdate(task.id, { category_id: e.target.value || undefined }); setEditingCat(false) }}
          onChange={e => { onUpdate(task.id, { category_id: e.target.value || undefined }); setEditingCat(false) }}
          onClick={e => e.stopPropagation()}
        >
          <option value="">Sin categoría</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}

      <div className="kanban-card-meta">
        <button className={`tag tag-btn priority-${task.priority}`} onClick={cyclePriority} title="Cambiar prioridad">
          {PRIORITY_ES[task.priority] ?? task.priority}
        </button>

        {!editingDate && (
          <button
            className={`tag tag-btn ${isOverdue ? "overdue" : "tag-date"}`}
            onClick={e => { e.stopPropagation(); setEditingDate(true) }}
          >
            {task.due_date ? `📅 ${formatDate(task.due_date)}` : "＋ Fecha"}
          </button>
        )}

        {editingDate && (
          <span className="kanban-date-inline" onClick={e => e.stopPropagation()}>
            <input
              ref={dateRef}
              type="date"
              className="kanban-date-input"
              defaultValue={task.due_date ?? ""}
              autoFocus
              onBlur={saveDate}
              onKeyDown={e => e.key === "Enter" && saveDate()}
            />
          </span>
        )}
      </div>
    </div>
  )
}
