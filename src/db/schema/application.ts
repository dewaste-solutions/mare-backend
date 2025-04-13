import { sql } from "drizzle-orm";
import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { oneTimeTokens } from "./auth";
import { statuses } from "./shared";

export const applicationSchema = pgSchema("application");

export const invitedUsers = applicationSchema.table("invited_users", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	statusId: uuid("status_id")
		.notNull()
		.references(() => statuses.id, { onDelete: "set null" }),
	oneTimeTokensId: uuid("one_time_tokens_id")
		.notNull()
		.references(() => oneTimeTokens.id, { onDelete: "cascade" }),
	email: text("email").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const onBoarding = applicationSchema.table("onboarding", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});
