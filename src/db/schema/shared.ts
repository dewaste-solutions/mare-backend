import { pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";

export const sharedSchema = pgSchema("shared");

export const statuses = sharedSchema.table("statuses", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	color: text("color").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});
