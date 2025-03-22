import { env } from "../env";
import { tryCatch } from "../helper/tryCatch";
import { seedAuthAccount } from "./seed-auth-account";
import { seedAuthRole } from "./seed-auth-role";

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

	// biome-ignore lint/suspicious/noConsole:
	console.table(
		seedAuthAccountData.map(({ email }) => ({
			email,
			password: `${email.split("@")[0]}`,
		})),
	);

	// biome-ignore lint/suspicious/noConsole:
	console.log("Seed data inserted successfully!");
})();
