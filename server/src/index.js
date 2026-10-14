import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "local-demo-secret-change-before-deploy";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storePath = path.resolve(__dirname, "../data/store.json");

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "100kb" }));

const services = [
  { id: "classic", name: "Classic Relaxation", duration: 60, price: 1499, description: "A calming full-body massage designed to ease everyday tension.", tag: "Most popular" },
  { id: "deep-tissue", name: "Deep Tissue", duration: 60, price: 1799, description: "Focused pressure for common areas of muscle tightness.", tag: "Targeted relief" },
  { id: "aroma", name: "Aromatherapy", duration: 75, price: 1999, description: "A relaxing session paired with aromatic massage oils.", tag: "Slow down" },
  { id: "head-shoulder", name: "Head & Shoulder", duration: 30, price: 899, description: "A shorter session focused on the head, neck, and shoulders.", tag: "Quick reset" }
];

async function readStore() {
  try { return JSON.parse(await fs.readFile(storePath, "utf8")); }
  catch { return { users: [], bookings: [] }; }
}
async function writeStore(data) {
  await fs.writeFile(storePath, JSON.stringify(data, null, 2));
}
function safeUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}
function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
}
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Please sign in to continue." });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ message: "Session expired. Please sign in again." }); }
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "RelaxAtHome API" }));
app.get("/api/services", (_req, res) => res.json(services));

app.post("/api/auth/register", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (name.length < 2) return res.status(400).json({ message: "Enter your name (at least 2 characters)." });
  if (!validEmail(email)) return res.status(400).json({ message: "Enter a valid email address." });
  if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
  const store = await readStore();
  if (store.users.some(user => user.email === email)) return res.status(409).json({ message: "An account with this email already exists." });
  const user = { id: crypto.randomUUID(), name, email, passwordHash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
  store.users.push(user);
  await writeStore(store);
  res.status(201).json({ user: safeUser(user), token: createToken(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const store = await readStore();
  const user = store.users.find(item => item.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Email or password is incorrect." });
  res.json({ user: safeUser(user), token: createToken(user) });
});

app.get("/api/bookings", auth, async (req, res) => {
  const store = await readStore();
  res.json(store.bookings.filter(item => item.userId === req.user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

app.post("/api/bookings", auth, async (req, res) => {
  const service = services.find(item => item.id === req.body.serviceId);
  const date = String(req.body.date || "");
  const time = String(req.body.time || "");
  const address = String(req.body.address || "").trim();
  const notes = String(req.body.notes || "").trim();
  if (!service) return res.status(400).json({ message: "Choose a valid massage service." });
  if (!date || !time || !address) return res.status(400).json({ message: "Service, date, time, and home address are required." });
  const selected = new Date(`${date}T${time}:00`);
  if (Number.isNaN(selected.getTime()) || selected.getTime() < Date.now() + 60 * 60 * 1000) {
    return res.status(400).json({ message: "Choose a time at least one hour from now." });
  }
  const store = await readStore();
  const hasConflict = store.bookings.some(item => item.status !== "cancelled" && item.date === date && item.time === time);
  if (hasConflict) return res.status(409).json({ message: "That time slot has just been requested. Please choose another time." });
  const booking = {
    id: crypto.randomUUID(), userId: req.user.id, serviceId: service.id,
    serviceName: service.name, duration: service.duration, price: service.price,
    date, time, address, notes, status: "pending", createdAt: new Date().toISOString()
  };
  store.bookings.push(booking);
  await writeStore(store);
  res.status(201).json(booking);
});

app.patch("/api/bookings/:id/cancel", auth, async (req, res) => {
  const store = await readStore();
  const booking = store.bookings.find(item => item.id === req.params.id && item.userId === req.user.id);
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  if (booking.status !== "pending") return res.status(400).json({ message: "Only pending bookings can be cancelled." });
  booking.status = "cancelled";
  booking.updatedAt = new Date().toISOString();
  await writeStore(store);
  res.json(booking);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(PORT, () => console.log(`RelaxAtHome API running at http://localhost:${PORT}`));
