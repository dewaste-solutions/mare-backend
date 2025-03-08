import express from "express";

import { createUser, getProfile, signInUser, signoutUser } from "../controller";
import { validateAuthSignIn, validateAuthSignup } from "../middleware";

export const authRoutes = express.Router();

authRoutes.post("/signup", validateAuthSignup, createUser);

authRoutes.post("/signin", validateAuthSignIn, signInUser);

authRoutes.post("/signout", signoutUser);

authRoutes.post("/profile", getProfile);
