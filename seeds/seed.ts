import { env } from "../src/env";
import { logger } from "../src/helper/logger";
import { seedAuthAccount } from "./seed-auth-account";
import { seedAuthRole } from "./seed-auth-role";
import { seedRequirementsFranchisee } from "./seed-requirements-franchisee";
import { seedStatuses } from "./seed-statuses";
import { truncateAllTables } from "./truncate-all-tables";
import { tryCatch } from "./tryCatch";

(async function seed() {
	if (env.NODE_ENV !== "development") {
		logger.error("❌ Skipping seeding in production environment.");
		logger.error(
			"Seeding involves deleting tables, which is unsafe in production.",
		);
		process.exit(1);
	}

	logger.info("Truncating all tables...");
	await truncateAllTables();
	logger.info("All tables truncated!");
	logger.info("Seeding database...");

	const { error: seedAuthRoleError } = await tryCatch(seedAuthRole());
	if (seedAuthRoleError) {
		logger.error(seedAuthRoleError);
		process.exit(1);
	}

	const { data: seedAuthAccountData, error: seedAuthAccountError } =
		await tryCatch(seedAuthAccount());
	if (seedAuthAccountError) {
		logger.error(seedAuthAccountError);
		process.exit(1);
	}

	const { error: seedStatusesError } = await tryCatch(seedStatuses());
	if (seedStatusesError) {
		logger.error(seedStatusesError);
		process.exit(1);
	}

	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.table(
		seedAuthAccountData.map(({ email }) => ({
			email,
			password: `${email.split("@")[0]}`,
		})),
	);

	const { error: seedRequirementsError } = await tryCatch(
		seedRequirementsFranchisee(),
	);
	if (seedRequirementsError) {
		logger.error(seedRequirementsError);
		process.exit(1);
	}

	logger.info("Seed data inserted successfully!");
})();
