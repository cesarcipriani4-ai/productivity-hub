import express from "express"
import { db } from "../index.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM goals ORDER BY created_at DESC")
  res.json(rows)
})

router.post("/", async (req, res) => {
  const { title, workspace_id, description, target_value } = req.body
  const { rows } = await db.query(
    "INSERT INTO goals (title, workspace_id, description, target_value) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, workspace_id, description, target_value]
  )
  res.json(rows[0])
})

export default router
