import cors from "cors";
import express from "express";

import env from "./env";
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
app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${env.PORT}`);
});
