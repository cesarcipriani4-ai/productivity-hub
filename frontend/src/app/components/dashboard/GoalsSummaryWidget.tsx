import { localStorageService } from "@core/services/localStorageService"

interface Goal { id: string; title: string; target: number; current: number }

export const GoalsSummaryWidget = () => {
  const goals = localStorageService.load<Goal[]>("goals-list", [])

  return (
    <section className="card">
      <h2>Objetivos</h2>
      {goals.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
          Sin metas aún — ve a Objetivos para crear una.
        </p>
      )}
      <div className="goals-list">
        {goals.slice(0, 3).map(g => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100))
          return (
            <div key={g.id} className="goal-item">
              <div className="goal-header">
                <span>{g.title}</span>
                <span className="goal-pct">{pct}%</span>
              </div>
              <div className="goal-bar">
                <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
