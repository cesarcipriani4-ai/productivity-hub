import { Link, useLocation } from "react-router-dom"
import { useTheme } from "@core/context/ThemeContext"
import { useAuth } from "@core/context/AuthContext"

const links = [
  { to: "/", label: "Dashboard", icon: "⊞" },
  { to: "/kanban", label: "Kanban", icon: "⋮⋮" },
  { to: "/calendar", label: "Calendario", icon: "⊡" },
  { to: "/goals", label: "Objetivos", icon: "◎" },
  { to: "/notes", label: "Notas", icon: "≡" },
  { to: "/settings", label: "Configuración", icon: "⚙" }
]

export const Sidebar = () => {
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">◈</span>
        Productivity Hub
      </div>
      <nav>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "sidebar-link active" : "sidebar-link"}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      {user && (
        <div className="sidebar-user">
          <span className="sidebar-user-name">👤 {user.name}</span>
          <button className="sidebar-logout" onClick={logout} title="Cerrar sesión">Salir</button>
        </div>
      )}
      <button className="theme-toggle" onClick={toggle} title="Cambiar tema">
        {theme === "dark" ? "☀ Modo claro" : "☽ Modo oscuro"}
      </button>
    </aside>
  )
}
