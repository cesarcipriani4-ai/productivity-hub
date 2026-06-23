import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db, ROLES } from "../index.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body
  const hash = await bcrypt.hash(password, 10)
  const { rows } = await db.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
    [name, email, hash, ROLES.USER]
  )
  res.json(rows[0])
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const { rows } = await db.query("SELECT * FROM users WHERE email=$1", [email])
  const user = rows[0]
  if (!user) return res.status(401).json({ error: "Usuario no encontrado" })
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" })
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } })
})

export default router
