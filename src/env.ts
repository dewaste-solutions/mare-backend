import path from "node:path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(
	config({
		path: path.resolve(
			process.cwd(),
			// biome-ignore lint/nursery/noProcessEnv: <explanation>
			process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		),
	}),
);

const EnvSchema = z.object({
	NODE_ENV: z.string().default("development"),
	BACKEND_PORT: z.coerce.number().default(6000),
	DATABASE_URL: z.string(),
	BACKEND_AUTH_PRIVATE_KEY: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

// biome-ignore lint/nursery/noProcessEnv: <explanation>
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
	// biome-ignore lint/suspicious/noConsole:
	console.error("❌ Invalid env:");
	// biome-ignore lint/suspicious/noConsole:
	console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
	process.exit(1);
}

// biome-ignore lint/style/noNonNullAssertion: Needed for safe env export
export default env!;
