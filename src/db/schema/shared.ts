import { sql } from "drizzle-orm";
import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sharedSchema = pgSchema("shared");

export const statuses = sharedSchema.table("statuses", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	name: text("name").notNull(),
	color: text("color").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});
