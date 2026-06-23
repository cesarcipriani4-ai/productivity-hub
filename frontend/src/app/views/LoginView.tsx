import { useRef, useState } from "react"
import { useAuth } from "@core/context/AuthContext"

export const LoginView = () => {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)

  const submit = async () => {
    const email = emailRef.current?.value?.trim() ?? ""
    const pass = passRef.current?.value ?? ""
    if (!email || !pass) { setError("Completa todos los campos"); return }
    setLoading(true); setError("")
    const err = mode === "login"
      ? await login(email, pass)
      : await register(nameRef.current?.value?.trim() ?? "", email, pass)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo">◈ Productivity Hub</div>
        <h1 className="login-title">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>

        <div className="login-form">
          {mode === "register" && (
            <input ref={nameRef} className="notes-input" type="text" placeholder="Tu nombre" />
          )}
          <input ref={emailRef} className="notes-input" type="email" placeholder="Correo electrónico" />
          <input ref={passRef} className="notes-input" type="password" placeholder="Contraseña"
            onKeyDown={e => e.key === "Enter" && submit()} />

          {error && <div className="login-error">{error}</div>}

          <button className="btn-primary login-btn" onClick={submit} disabled={loading}>
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Registrarse"}
          </button>
        </div>

        <div className="login-switch">
          {mode === "login" ? (
            <><span>¿No tienes cuenta?</span> <button className="login-link" onClick={() => { setMode("register"); setError("") }}>Crear cuenta</button></>
          ) : (
            <><span>¿Ya tienes cuenta?</span> <button className="login-link" onClick={() => { setMode("login"); setError("") }}>Iniciar sesión</button></>
          )}
        </div>

        <div className="login-divider">o</div>

        <button className="btn-ghost login-offline-btn" onClick={() => {
          localStorage.setItem("token", "offline")
          localStorage.setItem("user", JSON.stringify({ id: "local", name: "Usuario local", role: "user" }))
          window.location.reload()
        }}>
          Continuar sin cuenta (solo este dispositivo)
        </button>

        <div className="login-offline-note">
          Con cuenta, tus datos se sincronizan entre Mac, iPhone e iPad.
        </div>
      </div>
    </div>
  )
}
