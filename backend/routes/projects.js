import express from "express"
import { db } from "../index.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM projects ORDER BY created_at DESC")
  res.json(rows)
})

router.post("/", async (req, res) => {
  const { name, workspace_id, description } = req.body
  const { rows } = await db.query(
    "INSERT INTO projects (name, workspace_id, description) VALUES ($1, $2, $3) RETURNING *",
    [name, workspace_id, description]
  )
  res.json(rows[0])
})

export default router
