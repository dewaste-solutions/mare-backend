import { sql } from "drizzle-orm";
import { db } from "../src/db";
import { statuses } from "../src/db/schema/shared";

export async function seedStatuses() {
	await db.transaction(async (tx) => {
		await tx.insert(statuses).values([
			{ name: "pending", updatedAt: sql`NOW()`, color: "#D19D3B" },
			{ name: "in-progress", updatedAt: sql`NOW()`, color: "" },
			{ name: "completed", updatedAt: sql`NOW()`, color: "" },
			{ name: "failed", updatedAt: sql`NOW()`, color: "" },
			{ name: "canceled", updatedAt: sql`NOW()`, color: "#757575" },
			{ name: "accepted", updatedAt: sql`NOW()`, color: "#038167" },
			{ name: "declined", updatedAt: sql`NOW()`, color: "#FF5B5B" },
			{ name: "invited", updatedAt: sql`NOW()`, color: "" },
			{ name: "submitted", updatedAt: sql`NOW()`, color: "" },
		]);
	});
}
