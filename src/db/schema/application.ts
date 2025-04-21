import { sql } from "drizzle-orm";
import { pgSchema, timestamp, uuid } from "drizzle-orm/pg-core";

export const applicationSchema = pgSchema("application");

export const invitedUsers = applicationSchema.table("invited_users", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const onBoarding = applicationSchema.table("onboarding", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});
