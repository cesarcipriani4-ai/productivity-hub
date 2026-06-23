import { useTheme } from "@core/context/ThemeContext"
import { useRef, useState } from "react"
import { categoryService, type Category } from "@core/models/Category"

const load = (k: string, d: string) => localStorage.getItem(k) ?? d

export const SettingsView = () => {
  const { theme, toggle } = useTheme()
  const nameRef = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState(() => load("user-name", ""))
  const [timezone, setTimezone] = useState(() => load("user-tz", Intl.DateTimeFormat().resolvedOptions().timeZone))
  const [categories, setCategories] = useState<Category[]>(() => categoryService.load())
  const newCatNameRef = useRef<HTMLInputElement>(null)
  const newCatColorRef = useRef<HTMLInputElement>(null)
  const [pomWork, setPomWork] = useState(() => Number(load("pom-work", "25")))
  const [pomBreak, setPomBreak] = useState(() => Number(load("pom-break", "5")))
  const [lang] = useState("Español")

  const saveAll = () => {
    localStorage.setItem("user-name", nameRef.current?.value?.trim() ?? name)
    setName(nameRef.current?.value?.trim() ?? name)
    localStorage.setItem("user-tz", timezone)
    localStorage.setItem("pom-work", String(pomWork))
    localStorage.setItem("pom-break", String(pomBreak))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addCategory = () => {
    const name = newCatNameRef.current?.value?.trim()
    if (!name) return
    const color = newCatColorRef.current?.value ?? "#3b82f6"
    const updated = [...categories, { id: crypto.randomUUID(), name, color }]
    setCategories(updated); categoryService.save(updated)
    if (newCatNameRef.current) newCatNameRef.current.value = ""
  }

  const deleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id)
    setCategories(updated); categoryService.save(updated)
  }

  const clearAll = () => {
    if (!confirm("¿Borrar todos los datos? Esta acción no se puede deshacer.")) return
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="view settings-view">
      <div className="view-header"><h1>Configuración</h1></div>

      <div className="settings-grid">

        <div className="card settings-section">
          <h2>Perfil</h2>
          <div className="settings-row">
            <label>Tu nombre</label>
            <input ref={nameRef} className="notes-input" type="text" defaultValue={name} placeholder="Ej: César" />
          </div>
          <div className="settings-row">
            <label>Idioma</label>
            <input className="notes-input" type="text" value={lang} disabled style={{ opacity: 0.5 }} />
          </div>
          <div className="settings-row">
            <label>Zona horaria</label>
            <input className="notes-input" type="text" value={timezone} onChange={e => setTimezone(e.target.value)} />
          </div>
        </div>

        <div className="card settings-section">
          <h2>Apariencia</h2>
          <div className="settings-row">
            <label>Tema actual</label>
            <button className="btn-ghost" onClick={toggle}>
              {theme === "dark" ? "☀ Cambiar a claro" : "☽ Cambiar a oscuro"}
            </button>
          </div>
        </div>

        <div className="card settings-section">
          <h2>Pomodoro</h2>
          <div className="settings-row">
            <label>Tiempo de enfoque (min)</label>
            <input className="notes-input settings-num" type="number" min={1} max={90} value={pomWork}
              onChange={e => setPomWork(Number(e.target.value))} />
          </div>
          <div className="settings-row">
            <label>Tiempo de descanso (min)</label>
            <input className="notes-input settings-num" type="number" min={1} max={30} value={pomBreak}
              onChange={e => setPomBreak(Number(e.target.value))} />
          </div>
          <p className="settings-note">Los cambios se aplican al reiniciar el timer en Modo Enfoque.</p>
        </div>

        <div className="card settings-section">
          <h2>Categorías de tareas</h2>
          <div className="cat-list">
            {categories.map(c => (
              <div key={c.id} className="cat-item">
                <span className="cat-dot" style={{ background: c.color }} />
                <span className="cat-item-name">{c.name}</span>
                <button className="sidebar-logout" onClick={() => deleteCategory(c.id)}>×</button>
              </div>
            ))}
          </div>
          <div className="cat-add-row">
            <input ref={newCatNameRef} className="notes-input" type="text" placeholder="Nueva categoría..." style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addCategory()} />
            <input ref={newCatColorRef} className="cat-color-input" type="color" defaultValue="#3b82f6" title="Color" />
            <button className="btn-primary" onClick={addCategory}>+ Agregar</button>
          </div>
        </div>

        <div className="card settings-section">
          <h2>Datos</h2>
          <div className="settings-row">
            <label>Tareas guardadas</label>
            <span style={{ color: "var(--text-secondary)" }}>
              {JSON.parse(localStorage.getItem("tasks") ?? "[]").length} tareas
            </span>
          </div>
          <div className="settings-row">
            <label>Notas guardadas</label>
            <span style={{ color: "var(--text-secondary)" }}>
              {JSON.parse(localStorage.getItem("notes-list") ?? "[]").length} notas
            </span>
          </div>
          <div className="settings-row">
            <label>Objetivos</label>
            <span style={{ color: "var(--text-secondary)" }}>
              {JSON.parse(localStorage.getItem("goals-list") ?? "[]").length} metas
            </span>
          </div>
          <button className="btn-ghost" style={{ color: "#f87171", borderColor: "#f87171", marginTop: 8 }} onClick={clearAll}>
            Borrar todos los datos
          </button>
        </div>

      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
        <button className="btn-primary" onClick={saveAll}>Guardar cambios</button>
        {saved && <span style={{ color: "#4ade80", fontSize: "0.85rem" }}>✓ Guardado</span>}
      </div>
    </div>
  )
}
