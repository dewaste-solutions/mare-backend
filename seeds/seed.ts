import { env } from "../src/env";
import { seedAuthAccount } from "./seed-auth-account";
import { seedAuthRole } from "./seed-auth-role";
import { truncateAllTables } from "./truncate-all-tables";
import { tryCatch } from "./tryCatch";

(async function seed() {
	if (env.NODE_ENV !== "development") {
		// biome-ignore lint/suspicious/noConsole:
		console.error("❌ Skipping seeding in production environment.");
		// biome-ignore lint/suspicious/noConsole:
		console.error(
			"Seeding involves deleting tables, which is unsafe in production.",
		);
		process.exit(1);
	}

	// biome-ignore lint/suspicious/noConsole:
	console.log("🔄 Truncating all tables...");
	await truncateAllTables();
	// biome-ignore lint/suspicious/noConsole:
	console.log("✅ All tables truncated!");

	// biome-ignore lint/suspicious/noConsole:
	console.log("Seeding database...");

	const { error: seedAuthRoleError } = await tryCatch(seedAuthRole());
	if (seedAuthRoleError) {
		// biome-ignore lint/suspicious/noConsole:
		console.error(seedAuthRoleError);
		process.exit(1);
	}

	const { data: seedAuthAccountData, error: seedAuthAccountError } =
		await tryCatch(seedAuthAccount());
	if (seedAuthAccountError) {
		// biome-ignore lint/suspicious/noConsole:
		console.error(seedAuthAccountError);
		process.exit(1);
	}

	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.table(
		seedAuthAccountData.map(({ email }) => ({
			email,
			password: `${email.split("@")[0]}`,
		})),
	);

	// biome-ignore lint/suspicious/noConsole:
	console.log("Seed data inserted successfully!");
})();
