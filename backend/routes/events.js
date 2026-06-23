import express from "express"
import { db } from "../index.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM events ORDER BY start DESC")
  res.json(rows)
})

router.post("/", async (req, res) => {
  const { title, workspace_id, task_id, start, end, type } = req.body
  const { rows } = await db.query(
    `INSERT INTO events (title, workspace_id, task_id, start, "end", type)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, workspace_id, task_id, start, end, type || "focus"]
  )
  res.json(rows[0])
})

export default router
