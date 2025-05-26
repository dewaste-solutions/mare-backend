CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "shared";
--> statement-breakpoint
CREATE SCHEMA "application";
--> statement-breakpoint
CREATE TYPE "public"."token_type_enum" AS ENUM('email_verification', 'password_reset', 're_authentication', 'invitation');--> statement-breakpoint
CREATE TYPE "public"."requirements_component_enum" AS ENUM('radiogroup', 'input_text', 'input_email', 'textarea', 'date', 'select_upload');--> statement-breakpoint
CREATE TABLE "auth"."one_time_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_type" "token_type_enum" NOT NULL,
	"token_hash" text NOT NULL,
	"revoked" boolean,
	"metadata" jsonb,
	"not_after" timestamp NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "one_time_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "auth"."permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" text,
	"image" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"revoked" boolean DEFAULT false,
	"session_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth"."role_permissions_connection" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "role_permissions_connection_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "auth"."roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "auth"."sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"refresh_at" timestamp NOT NULL,
	"ip_address" text NOT NULL,
	"user_agent" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"encrypted_password" text NOT NULL,
	"recovery_token" text,
	"recovery_sent_at" timestamp,
	"role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "shared"."statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application"."assigned_verifier_connection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"onboarding_id" uuid NOT NULL,
	"is_signed" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application"."invited_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status_id" uuid NOT NULL,
	"one_time_tokens_id" uuid NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "invited_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "application"."onboarding" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status_id" uuid NOT NULL,
	"invited_users_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application"."requirement_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requirement_choice_answer_id" uuid,
	"requirement_question_id" uuid NOT NULL,
	"onboarding_id" uuid NOT NULL,
	"answer" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application"."requirement_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"requirement_step" integer NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "requirement_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "application"."requirement_choices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"requirement_question_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application"."requirement_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"is_required" boolean NOT NULL,
	"placeholder" text NOT NULL,
	"default_value" text NOT NULL,
	"component" "requirements_component_enum" NOT NULL,
	"order" numeric,
	"allow_multiple" boolean NOT NULL,
	"requirement_section_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application"."requirement_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"requirement_category_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "requirement_sections_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "auth"."one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."role_permissions_connection" ADD CONSTRAINT "role_permissions_connection_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."role_permissions_connection" ADD CONSTRAINT "role_permissions_connection_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "auth"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."assigned_verifier_connection" ADD CONSTRAINT "assigned_verifier_connection_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."assigned_verifier_connection" ADD CONSTRAINT "assigned_verifier_connection_onboarding_id_onboarding_id_fk" FOREIGN KEY ("onboarding_id") REFERENCES "application"."onboarding"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."invited_users" ADD CONSTRAINT "invited_users_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "shared"."statuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."invited_users" ADD CONSTRAINT "invited_users_one_time_tokens_id_one_time_tokens_id_fk" FOREIGN KEY ("one_time_tokens_id") REFERENCES "auth"."one_time_tokens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."onboarding" ADD CONSTRAINT "onboarding_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "shared"."statuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."onboarding" ADD CONSTRAINT "onboarding_invited_users_id_invited_users_id_fk" FOREIGN KEY ("invited_users_id") REFERENCES "application"."invited_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."requirement_answers" ADD CONSTRAINT "requirement_answers_requirement_choice_answer_id_requirement_choices_id_fk" FOREIGN KEY ("requirement_choice_answer_id") REFERENCES "application"."requirement_choices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."requirement_answers" ADD CONSTRAINT "requirement_answers_requirement_question_id_requirement_question_id_fk" FOREIGN KEY ("requirement_question_id") REFERENCES "application"."requirement_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."requirement_answers" ADD CONSTRAINT "requirement_answers_onboarding_id_onboarding_id_fk" FOREIGN KEY ("onboarding_id") REFERENCES "application"."onboarding"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."requirement_categories" ADD CONSTRAINT "requirement_categories_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."requirement_choices" ADD CONSTRAINT "requirement_choices_requirement_question_id_requirement_question_id_fk" FOREIGN KEY ("requirement_question_id") REFERENCES "application"."requirement_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."requirement_question" ADD CONSTRAINT "requirement_question_requirement_section_id_requirement_sections_id_fk" FOREIGN KEY ("requirement_section_id") REFERENCES "application"."requirement_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application"."requirement_sections" ADD CONSTRAINT "requirement_sections_requirement_category_id_requirement_categories_id_fk" FOREIGN KEY ("requirement_category_id") REFERENCES "application"."requirement_categories"("id") ON DELETE cascade ON UPDATE no action;