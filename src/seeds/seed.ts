import { env } from "../env";
import { tryCatch } from "../helper/tryCatch";
import { seedAuthAccount } from "./seed-auth-account";
import { seedAuthRole } from "./seed-auth-role";
import { db } from "../db";

async function truncateAllTables() {
    // Get all schemas except system schemas
    const schemas = await db.execute(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')`
    );

    for (const { schema_name } of schemas.rows) {
        // Get all tables in the schema
        const tables = await db.execute(
            `SELECT tablename FROM pg_tables WHERE schemaname = '${schema_name}'`
        );

        for (const { tablename } of tables.rows) {
            // Truncate each table
            await db.execute(`TRUNCATE TABLE "${schema_name}"."${tablename}" CASCADE`);

			// biome-ignore lint/suspicious/noConsole:
            console.log(`✅ Truncated table: ${schema_name}.${tablename}`);
        }
    }
}

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
