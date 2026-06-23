import { createContext, useContext, useState, useEffect } from "react"

interface User { id: string; name: string; role: string }
interface AuthCtx {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string) => Promise<string | null>
  logout: () => void
}

const Ctx = createContext<AuthCtx>({} as AuthCtx)
export const useAuth = () => useContext(Ctx)

const API = import.meta.env.VITE_API_URL

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "null") } catch { return null }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"))

  const persist = (tok: string, u: User) => {
    localStorage.setItem("token", tok)
    localStorage.setItem("user", JSON.stringify(u))
    setToken(tok); setUser(u)
  }

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? "Error al iniciar sesión"
      persist(data.token, data.user)
      return null
    } catch {
      return "No se pudo conectar al servidor"
    }
  }

  const register = async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? "Error al registrarse"
      return await login(email, password)
    } catch {
      return "No se pudo conectar al servidor"
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null); setUser(null)
  }

  return <Ctx.Provider value={{ user, token, login, register, logout }}>{children}</Ctx.Provider>
}
