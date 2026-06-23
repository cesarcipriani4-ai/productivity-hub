export interface Task {
  id: string
  project_id?: string
  title: string
  description?: string
  status: "backlog" | "todo" | "doing" | "done" | string
  priority: "low" | "medium" | "high" | string
  due_date?: string
  created_at?: string
  updated_at?: string
  assignee_id?: string
  labels?: string[]
  energy_level?: "low" | "medium" | "high" | string
  estimated_time_minutes?: number
  actual_time_minutes?: number
  category_id?: string
}
