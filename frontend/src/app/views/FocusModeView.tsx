import { useRef, useState } from "react"
import { PomodoroTimer } from "../components/focus/PomodoroTimer"
import { localStorageService } from "@core/services/localStorageService"
import type { Task } from "@core/models/Task"

export const FocusModeView = () => {
  const tasks = localStorageService.load<Task[]>("tasks", [])
  const [selectedId, setSelectedId] = useState<string>(tasks[0]?.id ?? "")
  const [customTask, setCustomTask] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const active = tasks.find(t => t.id === selectedId)
  const displayTitle = customTask || active?.title || "Sin tarea seleccionada"

  return (
    <div className="view focus-view">
      <div className="view-header"><h1>Modo Enfoque</h1></div>
      <div className="focus-container">
        <div className="card focus-task-card">
          <h2>Tarea actual</h2>

          <div className="focus-task-input-row">
            <input
              ref={inputRef}
              className="notes-input"
              type="text"
              placeholder="Escribe la tarea en la que trabajas..."
              defaultValue={active?.title ?? ""}
              onChange={e => setCustomTask(e.target.value)}
            />
          </div>

          {tasks.length > 0 && (
            <div className="focus-task-select-wrap">
              <label className="focus-label">O elige del Kanban:</label>
              <select
                className="focus-select"
                value={selectedId}
                onChange={e => {
                  setSelectedId(e.target.value)
                  setCustomTask("")
                  if (inputRef.current) inputRef.current.value = ""
                }}
              >
                <option value="">— Seleccionar tarea —</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="focus-active-label">
            Trabajando en: <strong>{displayTitle}</strong>
          </div>
        </div>

        <PomodoroTimer />
      </div>
    </div>
  )
}
