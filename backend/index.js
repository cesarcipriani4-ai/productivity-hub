import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { Pool } from "pg"
import http from "http"
import { WebSocketServer } from "ws"
import jwt from "jsonwebtoken"

import authRoutes from "./routes/auth.js"
import taskRoutes from "./routes/tasks.js"
import projectRoutes from "./routes/projects.js"
import notesRoutes from "./routes/notes.js"
import goalsRoutes from "./routes/goals.js"
import eventsRoutes from "./routes/events.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

export const ROLES = { ADMIN: "admin", USER: "user", EDITOR: "editor" }

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: "No token" })
  const token = header.replace("Bearer ", "")
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}

export const roleMiddleware = role => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: "Forbidden" })
  }
  next()
}

app.use("/auth", authRoutes)
app.use("/tasks", authMiddleware, taskRoutes)
app.use("/projects", authMiddleware, projectRoutes)
app.use("/notes", authMiddleware, notesRoutes)
app.use("/goals", authMiddleware, goalsRoutes)
app.use("/events", authMiddleware, eventsRoutes)

const server = http.createServer(app)
export const wss = new WebSocketServer({ server })

wss.on("connection", ws => {
  ws.send(JSON.stringify({ type: "connected", message: "WebSocket OK" }))
})

export const broadcast = msg => {
  const data = JSON.stringify(msg)
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(data)
  })
}

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`API + WS running on port ${PORT}`))
