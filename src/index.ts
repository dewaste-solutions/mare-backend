import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "./env";
import { notFoundLogger } from "./middleware/not-found-logger";
import { RateLimitCategory, applyRateLimit } from "./middleware/rate-limit";
import { authRoutes } from "./routes/auth-route";
import { commonRoute } from "./routes/common-route";
import { fileRoutes } from "./routes/file-route";

const app = express();
const PORT = env.BACKEND_PORT;
// app.use(
// 	cors({
// 	  origin: "http://localhost.com", // Replace with your frontend's origin
// 	  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
// 	  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// 	})
// );

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// PUT your api here and set a rate limit
app.use("/api/auth", applyRateLimit(RateLimitCategory.STRICT), authRoutes);
app.use("/api/common", applyRateLimit(RateLimitCategory.LENIENT), commonRoute);
app.use("/api", fileRoutes);

app.use(notFoundLogger());
// Start Server
app.listen(PORT, () => {
	// biome-ignore lint/suspicious/noConsole:
	console.log(`Server running on http://localhost:${PORT}`);
});
