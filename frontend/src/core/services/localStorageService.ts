export const localStorageService = {
  save(key: string, data: unknown) {
    localStorage.setItem(key, JSON.stringify(data))
  },
  load<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    try {
      return JSON.parse(raw)
    } catch {
      return fallback
    }
  }
}
