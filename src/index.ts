import cors from "cors";
import express from "express";

import { ENV } from "./config/env";
import { error, logger, notFound } from "./middleware";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger());

// Basic Route
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server is running!");
});
app.get("/error", (req, res, next) => {
  next(new Error("Something went wrong!"));
});

app.use(notFound());
app.use(error());

// Start Server
app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});
