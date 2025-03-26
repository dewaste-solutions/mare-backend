import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
	out: "./drizzle",
	schema: ["./src/db/schema/auth.ts", "./src/db/schema/file.ts"],
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
