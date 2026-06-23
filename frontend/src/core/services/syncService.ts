import { api } from "./api"
import { localStorageService } from "./localStorageService"
import type { Task } from "../models/Task"

export const syncService = {
  async syncTasks(): Promise<Task[]> {
    try {
      const remote = await api.tasks.list()
      localStorageService.save("tasks", remote)
      return remote
    } catch {
      return localStorageService.load<Task[]>("tasks", [])
    }
  },
  async syncGoals(): Promise<unknown[]> {
    try {
      const remote = await api.goals.list()
      localStorageService.save("goals-list", remote)
      return remote
    } catch {
      return localStorageService.load("goals-list", [])
    }
  },
  async syncNotes(): Promise<unknown[]> {
    try {
      const remote = await api.notes.list()
      localStorageService.save("notes-list", remote)
      return remote
    } catch {
      return localStorageService.load("notes-list", [])
    }
  }
}
