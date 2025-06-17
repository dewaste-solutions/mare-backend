import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "./env";
import { configureOpenApi } from "./lib/configure-open-api";
import { httpLogger } from "./middleware/http-logger";
import { notFoundLogger } from "./middleware/not-found-logger";
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

// docs
configureOpenApi(app);

// PUT your api here
app.use("/api/auth", authRoutes);
app.use("/api/shared", sharedRoute);
app.use("/api/application", applicationRoutes);

app.use(notFoundLogger());

// Start Server only if this file is being run directly (not imported for testing)
if (require.main === module) {
	app.listen(PORT, () => {
		// biome-ignore lint/suspicious/noConsole:
		console.log(`Server running on http://localhost:${PORT}`);
	});
}

export { app };
