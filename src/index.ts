import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "./env";
import { httpLogger } from "./middleware/http-logger";
import { notFoundLogger } from "./middleware/not-found-logger";
import { RateLimitCategory, applyRateLimit } from "./middleware/rate-limit";
import { applicationRoutes } from "./routes/application-route";
import { authRoutes } from "./routes/auth-route";
import { sharedRoute } from "./routes/shared-route";

const app = express();
const PORT = env.BACKEND_PORT;
app.use(
	cors({
		origin: env.BACKEND_FRONTEND_URL,
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());
app.use(httpLogger());

// PUT your api here and set a rate limit
app.use("/api/auth", applyRateLimit(RateLimitCategory.STRICT), authRoutes);
app.use("/api/shared", applyRateLimit(RateLimitCategory.LENIENT), sharedRoute);
app.use(
	"/api/application",
	applyRateLimit(RateLimitCategory.LENIENT),
	applicationRoutes,
);

app.use(notFoundLogger());

// Start Server only if this file is being run directly (not imported for testing)
if (require.main === module) {
	app.listen(PORT, () => {
		// biome-ignore lint/suspicious/noConsole:
		console.log(`Server running on http://localhost:${PORT}`);
	});
}

export { app };
