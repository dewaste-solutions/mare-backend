import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'

import { authRoutes } from "./routes/auth-route";
import env from "./env";
import {  applyRateLimit, RateLimitCategory } from "./middleware";

const app = express();
const PORT = env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Basic Route
app.get("/api", (req, res) => {
  res.send("Express + TypeScript Server is running!");
});

app.use("/api/auth", applyRateLimit(RateLimitCategory.MODERATE), authRoutes)

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
