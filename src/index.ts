import cors from "cors";
import express from "express";

import { ENV } from "./config/env";
import { logger } from "./middleware";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger());

// Basic Route
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server is running!");
});

// Start Server
app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});
