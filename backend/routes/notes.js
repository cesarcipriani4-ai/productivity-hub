import express from "express"
import { db } from "../index.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM notes ORDER BY created_at DESC")
  res.json(rows)
})

router.post("/", async (req, res) => {
  const { title, content, workspace_id } = req.body
  const { rows } = await db.query(
    "INSERT INTO notes (title, content, workspace_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, workspace_id]
  )
  res.json(rows[0])
})

export default router
