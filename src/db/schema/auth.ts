import { sql } from "drizzle-orm";
import {
	boolean,
	jsonb,
	pgEnum,
	pgSchema,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");
export const applicationSchema = pgSchema("application");

export const users = authSchema.table("users", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	encryptedPassword: text("encrypted_password").notNull(),
	// Token for password reset (forgot password).
	recoveryToken: text("recovery_token"),
	recoverySentAt: timestamp("recovery_sent_at"),

	roleId: uuid("role_id")
		.notNull()
		.references(() => roles.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const profiles = authSchema.table("profiles", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	phoneNumber: text("phone_number"),
	image: text("image"),

	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const sessions = authSchema.table("sessions", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	refreshAt: timestamp("refresh_at").notNull(),
	ipAddress: text("ip_address").notNull(),
	userAgent: text("user_agent").notNull(),

	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const refreshTokens = authSchema.table("refresh_tokens", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	token: text("token").notNull().unique(),
	revoked: boolean("revoked").default(false),

	sessionId: uuid("session_id")
		.notNull()
		.references(() => sessions.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const tokenTypeEnum = pgEnum("token_type_enum", [
	"email_verification",
	"password_reset",
	"re_authentication",
	"invitation",
]);

export const oneTimeTokens = authSchema.table("one_time_tokens", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	tokenType: tokenTypeEnum("token_type").notNull(),
	tokenHash: text("token_hash").notNull().unique(),
	revoked: boolean("revoked").default(false),
	metadata: jsonb("metadata"),
	notAfter: timestamp("not_after").notNull(),
	userId: uuid("user_id").references(() => profiles.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const userRoleEnum = pgEnum("user_role_enum", [
	"admin",
	"guest",
	"franchise",
	"worker",
	"manager",
	"community",
]);

export const roles = authSchema.table("roles", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	name: userRoleEnum("name").notNull().unique(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const permissions = authSchema.table("permissions", {
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
	scope: text("scope").notNull(),
	description: text("description").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const rolePermissionConnection = authSchema.table(
	"role_permissions_connection",
	{
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		permissionId: uuid("permission_id")
			.notNull()
			.references(() => permissions.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const invitedUsers = applicationSchema.table("invited_users", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	email: text("email").notNull().unique(),
	oneTimeTokenId: uuid("one_time_token_id")
		.notNull()
		.references(() => oneTimeTokens.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const onboarding = applicationSchema.table("onboarding", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	statusId: uuid("status_id").notNull(),
	invitedUsersId: uuid("invited_users_id")
		.notNull()
		.references(() => invitedUsers.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const requirementAnswers = applicationSchema.table(
	"requirement_answers",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		requirementId: uuid("requirement_id").notNull(),
		onboardingId: uuid("onboarding_id")
			.notNull()
			.references(() => onboarding.id, { onDelete: "cascade" }),
		answer: text("answer"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
);

export const requirementAnswersFiles = applicationSchema.table(
	"requirement_answers_files",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		requirementFileId: uuid("requirement_file_id").notNull(),
		filePath: text("file_path").notNull(),
		onboardingId: uuid("onboarding_id")
			.notNull()
			.references(() => onboarding.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
);
