export const CalendarMiniWidget = () => {
  const today = new Date()
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const month = today.toLocaleString("es", { month: "long", year: "numeric" })

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  return (
    <section className="card">
      <h2>Calendario</h2>
      <div className="mini-cal">
        <div className="mini-cal-month">{month}</div>
        <div className="mini-cal-grid">
          {days.map(d => <div key={d} className="mini-cal-header">{d}</div>)}
          {cells.map((d, i) => (
            <div
              key={i}
              className={`mini-cal-day${d === today.getDate() ? " today" : ""}${d === null ? " empty" : ""}`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
