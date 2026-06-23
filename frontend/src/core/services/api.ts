import type { Task } from "../models/Task"

const API = import.meta.env.VITE_API_URL

const headers = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const get = (path: string) => fetch(`${API}${path}`, { headers: headers() }).then(r => r.json())
const post = (path: string, body: unknown) => fetch(`${API}${path}`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(r => r.json())
const put = (path: string, body: unknown) => fetch(`${API}${path}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) }).then(r => r.json())
const del = (path: string) => fetch(`${API}${path}`, { method: "DELETE", headers: headers() }).then(r => r.json())

export const api = {
  tasks: {
    list: (): Promise<Task[]> => get("/tasks"),
    create: (t: Partial<Task>): Promise<Task> => post("/tasks", t),
    update: (id: string, t: Partial<Task>): Promise<Task> => put(`/tasks/${id}`, t),
    delete: (id: string) => del(`/tasks/${id}`)
  },
  goals: {
    list: () => get("/goals"),
    create: (g: unknown) => post("/goals", g)
  },
  notes: {
    list: () => get("/notes"),
    create: (n: unknown) => post("/notes", n)
  }
}
