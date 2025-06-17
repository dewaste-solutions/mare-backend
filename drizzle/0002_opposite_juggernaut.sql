CREATE SCHEMA "workers";
--> statement-breakpoint
CREATE TYPE "public"."user_status_enum" AS ENUM('pending_approval', 'verified', 'suspended', 'deactivated');--> statement-breakpoint
CREATE TABLE "workers"."collection_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"waste_type" uuid NOT NULL,
	"weight" text NOT NULL,
	"location" uuid NOT NULL,
	"item_category" uuid NOT NULL,
	"sub_category" uuid NOT NULL,
	"item_came" uuid NOT NULL,
	"photo" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workers"."item_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workers"."item_name" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workers"."location_collection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workers"."sub_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workers"."waste_collectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workers"."waste_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."users" ADD COLUMN "status" "user_status_enum" DEFAULT 'pending_approval' NOT NULL;--> statement-breakpoint
ALTER TABLE "workers"."collection_stages" ADD CONSTRAINT "collection_stages_waste_type_waste_type_id_fk" FOREIGN KEY ("waste_type") REFERENCES "workers"."waste_type"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workers"."collection_stages" ADD CONSTRAINT "collection_stages_location_location_collection_id_fk" FOREIGN KEY ("location") REFERENCES "workers"."location_collection"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workers"."collection_stages" ADD CONSTRAINT "collection_stages_item_category_item_category_id_fk" FOREIGN KEY ("item_category") REFERENCES "workers"."item_category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workers"."collection_stages" ADD CONSTRAINT "collection_stages_sub_category_sub_category_id_fk" FOREIGN KEY ("sub_category") REFERENCES "workers"."sub_category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workers"."collection_stages" ADD CONSTRAINT "collection_stages_item_came_item_name_id_fk" FOREIGN KEY ("item_came") REFERENCES "workers"."item_name"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workers"."waste_collectors" ADD CONSTRAINT "waste_collectors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;