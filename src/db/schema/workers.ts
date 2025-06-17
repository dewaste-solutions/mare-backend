import { sql } from "drizzle-orm";
import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const applicationSchema = pgSchema("workers");

// some info of workers
export const wasteCollectors = applicationSchema.table("waste_collectors", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	facility: text("facility"),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

// choices
export const wasteType = applicationSchema.table("waste_type", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

// choices
export const locationCollection = applicationSchema.table(
	"location_collection",
	{
		id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
		name: text("name").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull(),
	},
);

// choices
export const itemCategory = applicationSchema.table("item_category", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

// choices
export const subCategory = applicationSchema.table("sub_category", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

// choices
export const itemName = applicationSchema.table("item_name", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

// stages
export const collectionStages = applicationSchema.table("collection_stages", {
	id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
	wasteType: uuid("waste_type")
		.notNull()
		.references(() => wasteType.id, { onDelete: "set null" }),
	weight: text("weight").notNull(),
	location: uuid("location")
		.notNull()
		.references(() => locationCollection.id, { onDelete: "set null" }),
	itemCategory: uuid("item_category")
		.notNull()
		.references(() => itemCategory.id, { onDelete: "set null" }),
	subCategory: uuid("sub_category")
		.notNull()
		.references(() => subCategory.id, { onDelete: "set null" }),
	itemName: uuid("item_came")
		.notNull()
		.references(() => itemName.id, { onDelete: "set null" }),
	photo: text("photo").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull(),
});

// export const preProcessingStages = applicationSchema.table("pre_processing_stages", {
//     id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at").notNull(),
// });

// export const wasteStagesType = applicationSchema.table("waste_stages_type", {
//     id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
//     name: text("name").notNull(),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at").notNull(),
// });

// export const preProcessedItem = applicationSchema.table("pre_processed_item", {
//     id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
//     name: text("name").notNull(),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at").notNull(),
// });

// export const leftoverStatus = applicationSchema.table("leftover_status", {
//     id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
//     name: text("name").notNull(),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at").notNull(),
// });
