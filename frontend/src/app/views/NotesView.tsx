import { useRef, useState } from "react"

interface Note {
  id: string
  title: string
  content: string
  created: string
}

const KEY = "notes-list"

const load = (): Note[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") } catch { return [] }
}

export const NotesView = () => {
  const [notes, setNotes] = useState<Note[]>(load)
  const [selected, setSelected] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const save = (ns: Note[]) => {
    setNotes(ns)
    localStorage.setItem(KEY, JSON.stringify(ns))
  }

  const addNote = () => {
    const title = titleRef.current?.value?.trim() || "Sin título"
    const content = contentRef.current?.value?.trim() || ""
    const note: Note = { id: crypto.randomUUID(), title, content, created: new Date().toLocaleString("es") }
    save([note, ...notes])
    setSelected(note.id)
    if (titleRef.current) titleRef.current.value = ""
    if (contentRef.current) contentRef.current.value = ""
  }

  const deleteNote = (id: string) => {
    save(notes.filter(n => n.id !== id))
    if (selected === id) setSelected(null)
  }

  const current = notes.find(n => n.id === selected)

  return (
    <div className="view notes-view">
      <div className="view-header"><h1>Notas</h1></div>
      <div className="notes-layout">
        <div className="notes-sidebar">
          <div className="notes-form">
            <input ref={titleRef} className="notes-input" type="text" placeholder="Título de la nota..." />
            <textarea ref={contentRef} className="notes-quick-textarea" placeholder="Contenido..." />
            <button className="btn-primary" onClick={addNote}>+ Nueva nota</button>
          </div>
          <div className="notes-list-items">
            {notes.length === 0 && <p className="notes-empty">Sin notas aún</p>}
            {notes.map(n => (
              <div
                key={n.id}
                className={`note-item${selected === n.id ? " active" : ""}`}
                onClick={() => setSelected(n.id)}
              >
                <div className="note-item-title">{n.title}</div>
                <div className="note-item-date">{n.created}</div>
                <button className="note-delete" onClick={e => { e.stopPropagation(); deleteNote(n.id) }}>×</button>
              </div>
            ))}
          </div>
        </div>
        <div className="notes-content card">
          {current
            ? <>
                <h2>{current.title}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{current.created}</p>
                <p style={{ whiteSpace: "pre-wrap" }}>{current.content || <em style={{ color: "var(--text-muted)" }}>Sin contenido</em>}</p>
              </>
            : <p style={{ color: "var(--text-muted)" }}>Selecciona o crea una nota</p>
          }
        </div>
      </div>
    </div>
  )
}
