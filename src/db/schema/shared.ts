import {
	pgSchema,
	text,
	timestamp,
    serial
} from "drizzle-orm/pg-core";

export const sharedSchema = pgSchema("shared");

export const statuses = sharedSchema.table("statuses", {
    id: serial('id').primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});
