import { useRef, useState } from "react"

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  deadline: string
  created: string
}

const KEY = "goals-list"
const load = (): Goal[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]") } catch { return [] } }
const save = (g: Goal[]) => localStorage.setItem(KEY, JSON.stringify(g))

export const GoalsView = () => {
  const [goals, setGoals] = useState<Goal[]>(load)
  const [showForm, setShowForm] = useState(false)

  const titleRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)
  const targetRef = useRef<HTMLInputElement>(null)
  const deadlineRef = useRef<HTMLInputElement>(null)

  const addGoal = () => {
    const title = titleRef.current?.value?.trim()
    if (!title) return
    const g: Goal = {
      id: crypto.randomUUID(),
      title,
      description: descRef.current?.value?.trim() ?? "",
      target: Number(targetRef.current?.value) || 100,
      current: 0,
      deadline: deadlineRef.current?.value ?? "",
      created: new Date().toLocaleDateString("es")
    }
    const updated = [g, ...goals]
    setGoals(updated); save(updated)
    setShowForm(false)
  }

  const updateProgress = (id: string, val: number) => {
    const updated = goals.map(g => g.id === id ? { ...g, current: Math.min(Math.max(0, val), g.target) } : g)
    setGoals(updated); save(updated)
  }

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id)
    setGoals(updated); save(updated)
  }

  return (
    <div className="view goals-view">
      <div className="view-header">
        <h1>Objetivos</h1>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? "Cancelar" : "+ Nueva meta"}
        </button>
      </div>

      {showForm && (
        <div className="card goal-form">
          <h2>Nueva meta</h2>
          <div className="goal-form-grid">
            <div className="goal-form-group">
              <label>Título</label>
              <input ref={titleRef} className="notes-input" type="text" placeholder="Ej: Completar 10 ventas" />
            </div>
            <div className="goal-form-group">
              <label>Fecha límite</label>
              <input ref={deadlineRef} className="notes-input" type="date" />
            </div>
            <div className="goal-form-group goal-form-full">
              <label>Descripción</label>
              <textarea ref={descRef} className="notes-quick-textarea" placeholder="Describe tu objetivo..." style={{ minHeight: 60 }} />
            </div>
            <div className="goal-form-group">
              <label>Meta (valor objetivo)</label>
              <input ref={targetRef} className="notes-input" type="number" placeholder="100" min="1" />
            </div>
          </div>
          <button className="btn-primary" onClick={addGoal}>Guardar meta</button>
        </div>
      )}

      {goals.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p style={{ color: "var(--text-muted)" }}>No hay metas aún. Crea la primera.</p>
        </div>
      )}

      <div className="goals-cards">
        {goals.map(g => {
          const pct = Math.round((g.current / g.target) * 100)
          const isOverdue = g.deadline && new Date(g.deadline + "T23:59:59") < new Date()
          return (
            <div key={g.id} className="card goal-card">
              <div className="goal-card-header">
                <div>
                  <div className="goal-card-title">{g.title}</div>
                  {g.deadline && (
                    <div className={`goal-card-deadline${isOverdue ? " overdue-text" : ""}`}>
                      📅 {new Date(g.deadline + "T12:00:00").toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  )}
                </div>
                <button className="note-delete" style={{ opacity: 1, position: "static" }} onClick={() => deleteGoal(g.id)}>×</button>
              </div>

              {g.description && <p className="goal-card-desc">{g.description}</p>}

              <div className="goal-header">
                <span>{g.current} / {g.target}</span>
                <span className="goal-pct">{pct}%</span>
              </div>
              <div className="goal-bar">
                <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
              </div>

              <div className="goal-controls">
                <button className="btn-ghost goal-btn" onClick={() => updateProgress(g.id, g.current - 1)}>−</button>
                <input
                  className="goal-input-num"
                  type="number"
                  value={g.current}
                  min={0}
                  max={g.target}
                  onChange={e => updateProgress(g.id, Number(e.target.value))}
                />
                <button className="btn-ghost goal-btn" onClick={() => updateProgress(g.id, g.current + 1)}>+</button>
                <button className="btn-primary goal-btn" onClick={() => updateProgress(g.id, g.target)} style={{ marginLeft: "auto" }}>✓ Completar</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
