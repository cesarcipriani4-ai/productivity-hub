import { useState } from "react"
import { localStorageService } from "@core/services/localStorageService"
import type { Task } from "@core/models/Task"

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
const PRIORITY_COLOR: Record<string, string> = { high: "#ef4444", medium: "#f97316", low: "#22c55e" }

export const CalendarView = () => {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)

  const tasks: Task[] = localStorageService.load("tasks", [])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const tasksByDate: Record<string, Task[]> = {}
  tasks.forEach(t => {
    if (!t.due_date) return
    const key = t.due_date.slice(0, 10)
    const d = new Date(key)
    if (d.getFullYear() === year && d.getMonth() === month) {
      tasksByDate[key] = [...(tasksByDate[key] ?? []), t]
    }
  })

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const pad = (n: number) => String(n).padStart(2, "0")
  const selectedTasks = selected ? (tasksByDate[selected] ?? []) : []

  return (
    <div className="view calendar-view">
      <div className="view-header"><h1>Calendario</h1></div>
      <div className="cal-layout">
        <div className="cal-main card">
          <div className="cal-header">
            <button className="btn-ghost cal-nav" onClick={prev}>‹</button>
            <span className="cal-title">{MONTHS[month]} {year}</span>
            <button className="btn-ghost cal-nav" onClick={next}>›</button>
          </div>
          <div className="cal-grid">
            {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
            {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const key = `${year}-${pad(month + 1)}-${pad(day)}`
              const dayTasks = tasksByDate[key] ?? []
              const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
              const isSelected = selected === key
              return (
                <div
                  key={key}
                  className={`cal-day${isToday ? " today" : ""}${isSelected ? " selected" : ""}${dayTasks.length ? " has-tasks" : ""}`}
                  onClick={() => setSelected(isSelected ? null : key)}
                >
                  <span className="cal-day-num">{day}</span>
                  <div className="cal-dots">
                    {dayTasks.slice(0, 3).map(t => (
                      <span key={t.id} className="cal-dot" style={{ background: PRIORITY_COLOR[t.priority] ?? "#818cf8" }} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="cal-sidebar card">
          <h2>{selected ? new Date(selected + "T12:00:00").toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" }) : "Selecciona un día"}</h2>
          {selected && selectedTasks.length === 0 && (
            <p className="cal-empty">Sin tareas este día</p>
          )}
          {selectedTasks.map(t => (
            <div key={t.id} className="cal-task-item" style={{ borderLeft: `3px solid ${PRIORITY_COLOR[t.priority] ?? "#818cf8"}` }}>
              <div className="cal-task-title">{t.title}</div>
              <div className="cal-task-meta">
                <span className={`tag priority-${t.priority}`}>{t.priority === "high" ? "Alta" : t.priority === "medium" ? "Media" : "Baja"}</span>
                <span className="tag">{t.status === "done" ? "✓ Hecho" : t.status === "doing" ? "En progreso" : t.status === "todo" ? "Por hacer" : "Backlog"}</span>
              </div>
            </div>
          ))}
          {!selected && (
            <p className="cal-empty">Las tareas con fecha aparecen aquí. Agrega fechas desde el Kanban.</p>
          )}
        </div>
      </div>
    </div>
  )
}
