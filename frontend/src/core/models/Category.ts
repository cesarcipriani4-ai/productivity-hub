export interface Category {
  id: string
  name: string
  color: string
}

const KEY = "categories"

const DEFAULTS: Category[] = [
  { id: "fam", name: "Familia", color: "#f97316" },
  { id: "uni", name: "Universidad UTP", color: "#0ea5e9" },
  { id: "work", name: "Mi Unidad", color: "#10b981" },
  { id: "per", name: "Personal", color: "#a855f7" },
]

export const categoryService = {
  load(): Category[] {
    try { return JSON.parse(localStorage.getItem(KEY) ?? "null") || DEFAULTS }
    catch { return DEFAULTS }
  },
  save(cats: Category[]) {
    localStorage.setItem(KEY, JSON.stringify(cats))
  },
  find(id: string): Category | undefined {
    return this.load().find(c => c.id === id)
  }
}
