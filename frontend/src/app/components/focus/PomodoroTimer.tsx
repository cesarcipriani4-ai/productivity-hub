import { useEffect, useState } from "react"

const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60

export const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          if (!isBreak) setSessions(s => s + 1)
          setIsBreak(b => !b)
          return isBreak ? WORK_TIME : BREAK_TIME
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, isBreak])

  const format = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  const pct = ((isBreak ? BREAK_TIME : WORK_TIME) - seconds) / (isBreak ? BREAK_TIME : WORK_TIME)
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div className="pomodoro">
      <div className="pomodoro-phase">{isBreak ? "☕ Descanso" : "🎯 Enfoque"}</div>
      <div className="pomodoro-ring">
        <svg viewBox="0 0 120 120" width="160" height="160">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1f2937" strokeWidth="8" />
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke={isBreak ? "#34d399" : "#818cf8"}
            strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dasharray 0.9s linear" }}
          />
        </svg>
        <div className={`pomodoro-time ${seconds < 60 && isRunning ? "warning" : ""}`}>
          {format(seconds)}
        </div>
      </div>
      <div className="pomodoro-controls">
        <button className="btn-primary" onClick={() => setIsRunning(r => !r)}>
          {isRunning ? "Pausar" : "Iniciar"}
        </button>
        <button className="btn-ghost" onClick={() => { setIsRunning(false); setIsBreak(false); setSeconds(WORK_TIME) }}>
          Reiniciar
        </button>
      </div>
      <div className="pomodoro-sessions">Sesiones completadas: {sessions}</div>
    </div>
  )
}
