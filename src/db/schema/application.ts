import { sql } from "drizzle-orm";
import {
	boolean,
	integer,
	numeric,
	pgEnum,
	pgSchema,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
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
	email: text("email").notNull().unique(),
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

export const requirementChoices = applicationSchema.table(
	"requirement_choices",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		name: text("name").notNull(),
		requirementQuestionId: uuid("requirement_question_id")
			.notNull()
			.references(() => requirementQuestion.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
	},
);

export const requirementsComponentEnum = pgEnum("requirements_component_enum", [
	"radiogroup",
	"input_text",
	"input_email",
	"textarea",
	"date",
	"select_upload",
]);

export const requirementSections = applicationSchema.table(
	"requirement_sections",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		name: text("name").notNull(),
		order: integer("order").notNull(),
		requirementCategoryId: uuid("requirement_category_id")
			.notNull()
			.references(() => requirementCategories.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
	},
);

export const requirementCategories = applicationSchema.table(
	"requirement_categories",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		name: text("name").notNull(),
		requirementStep: integer("requirement_step").notNull(),
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
	},
);

export const requirementQuestion = applicationSchema.table(
	"requirement_question",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		question: text("name").notNull(),
		description: text("description").notNull(),
		isRequired: boolean("is_required").notNull(),
		placeholder: text("placeholder").notNull(),
		defaultValue: text("default_value").notNull(),
		component: requirementsComponentEnum("component").notNull(),
		order: numeric("order"),
		allowMultiple: boolean("allow_multiple").notNull(),
		requirementSectionId: uuid("requirement_section_id")
			.notNull()
			.references(() => requirementSections.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
	},
);

export const requirementAnswers = applicationSchema.table(
	"requirement_answers",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		requirementChoiceAnswerId: uuid("requirement_choice_answer_id").references(
			() => requirementChoices.id,
			{ onDelete: "set null" },
		),
		requirementsQuestionId: uuid("requirement_question_id")
			.notNull()
			.references(() => requirementQuestion.id, { onDelete: "cascade" }),
		onBoardingId: uuid("onboarding_id")
			.notNull()
			.references(() => onBoarding.id, { onDelete: "cascade" }),
		answer: text("answer"),
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
