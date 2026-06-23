import { useRef } from "react"

export const NotesQuickWidget = () => {
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSave = () => {
    const val = ref.current?.value?.trim()
    if (val) {
      localStorage.setItem("quick-note", val)
      if (ref.current) ref.current.value = ""
    }
  }

  return (
    <section className="card">
      <h2>Nota rápida</h2>
      <textarea
        ref={ref}
        className="notes-quick-textarea"
        placeholder="Escribe una idea rápida..."
        defaultValue=""
      />
      <button className="btn-ghost" onClick={handleSave}>
        Guardar
      </button>
    </section>
  )
}
