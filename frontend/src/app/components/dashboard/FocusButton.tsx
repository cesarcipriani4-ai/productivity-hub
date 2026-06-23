import { useNavigate } from "react-router-dom"

export const FocusButton = () => {
  const navigate = useNavigate()
  return (
    <section className="card focus-card">
      <h2>Modo Enfoque</h2>
      <p>Trabaja en una sola tarea con temporizador Pomodoro.</p>
      <button className="btn-primary" onClick={() => navigate("/focus/1")}>
        Entrar en modo enfoque
      </button>
    </section>
  )
}
