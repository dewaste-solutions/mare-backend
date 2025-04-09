import { sql } from "drizzle-orm";
import { boolean, pgSchema, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { oneTimeTokens, roles, users } from "./auth";
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
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const onBoarding = applicationSchema.table("onboarding", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	statusId: uuid("status_id")
		.notNull()
		.references(() => statuses.id, { onDelete: "set null" }),
	invitedUsersId: uuid("invited_users_id")
		.notNull()
		.references(() => invitedUsers.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const optionChoices = applicationSchema.table("option_choices", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	requirementOptionId: uuid("requirement_option_id")
		.notNull()
		.references(() => requirementOptions.id, { onDelete: "cascade" }),
	value: text("value").notNull(),
	label: text("label").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const requirementOptions = applicationSchema.table(
	"requirement_options",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		requirementsId: uuid("requirements_id")
			.notNull()
			.references(() => requirements.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
	},
);

export const requirements = applicationSchema.table("requirements", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	name: text("name").notNull(),
	description: text("description").notNull(),
	isRequired: boolean("is_required").notNull(),
	placeholder: text("placeholder").notNull(),
	defaultValue: text("default_value").notNull(),
	component: text("component").notNull(),
	onboardingStep: integer("onboarding_step")
		.notNull(),
	roleId: uuid("role_id")
		.notNull()
		.references(() => roles.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const requirementAnswers = applicationSchema.table(
	"requirement_answers",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		requirementsId: uuid("requirement_id")
			.notNull()
			.references(() => requirements.id, { onDelete: "cascade" }),
		answer: text("answer"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
		statusId: uuid("status_id")
			.notNull()
			.references(() => statuses.id, { onDelete: "set null" }),
		onBoardingId: uuid("onboarding_id")
			.notNull()
			.references(() => onBoarding.id, { onDelete: "cascade" }),
	},
);

export const requirementFiles = applicationSchema.table("requirement_files", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	requirementId: uuid("requirement_id")
		.notNull()
		.references(() => requirements.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const requirementAnswersFiles = applicationSchema.table(
	"requirement_answers_files",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		requirementFileId: uuid("requirement_file_id")
			.notNull()
			.references(() => requirementFiles.id, { onDelete: "cascade" }),
		statusId: uuid("status_id")
			.notNull()
			.references(() => statuses.id, { onDelete: "set null" }),
		filePath: text("file_path").notNull(),
		onBoardingId: uuid("onboarding_id")
			.notNull()
			.references(() => onBoarding.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
	},
);

export const assignedVerifierConnection = applicationSchema.table(
	"assigned_verifier_connection",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		onBoardingId: uuid("onboarding_id")
			.notNull()
			.references(() => onBoarding.id, { onDelete: "cascade" }),
		isSigned: boolean("is_signed").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
	},
);
