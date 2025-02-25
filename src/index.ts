import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { logger } from "./middleware";

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger());

// Basic Route
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server is running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
