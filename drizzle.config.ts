import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";
import { env } from "./src/env";
import { formatCertificate } from "./src/helper/format-certificate";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
	out: "./drizzle",
	schema: [
		"./src/db/schema/auth.ts",
		"./src/db/schema/shared.ts",
		"./src/db/schema/application.ts",
		"./src/db/schema/workers.ts",
	],
	dialect: "postgresql",
	dbCredentials: {
		database: env.DATABASE_NAME,
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		host: env.DATABASE_HOST,
		port: env.DATABASE_PORT,
		ssl:
			env.CA_CERT !== ""
				? {
						rejectUnauthorized: true,
						ca: formatCertificate(env.CA_CERT),
					}
				: false,
	},
} satisfies Config);
