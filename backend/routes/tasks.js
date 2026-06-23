import express from "express"
import { db, broadcast } from "../index.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM tasks ORDER BY created_at DESC")
  res.json(rows)
})

router.post("/", async (req, res) => {
  const { title, status, project_id } = req.body
  const { rows } = await db.query(
    "INSERT INTO tasks (title, status, project_id) VALUES ($1, $2, $3) RETURNING *",
    [title, status || "todo", project_id]
  )
  const task = rows[0]
  broadcast({ type: "task_created", task })
  res.json(task)
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const updates = req.body
  const fields = Object.keys(updates)
  const values = Object.values(updates)
  const setClause = fields.map((f, i) => `${f}=$${i + 1}`).join(", ")
  const { rows } = await db.query(
    `UPDATE tasks SET ${setClause}, updated_at=NOW() WHERE id=$${fields.length + 1} RETURNING *`,
    [...values, id]
  )
  const task = rows[0]
  broadcast({ type: "task_updated", task })
  res.json(task)
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  await db.query("DELETE FROM tasks WHERE id=$1", [id])
  broadcast({ type: "task_deleted", id })
  res.json({ success: true })
})

export default router
