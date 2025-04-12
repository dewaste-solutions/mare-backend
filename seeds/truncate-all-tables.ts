import { db } from "../src/db";

export async function truncateAllTables() {
	// Get all schemas except system schemas
	const schemas = await db.execute(
		`SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')`,
	);

	for (const { schema_name } of schemas.rows) {
		// Get all tables in the schema
		const tables = await db.execute(
			`SELECT tablename FROM pg_tables WHERE schemaname = '${schema_name}'`,
		);

		for (const { tablename } of tables.rows) {
			// Truncate each table
			await db.execute(
				`TRUNCATE TABLE "${schema_name}"."${tablename}" CASCADE`,
			);
		}
	}
}
