import { pgSchema, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const fileSchema = pgSchema("file-upload");

export const files = fileSchema.table("files", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	originalName: varchar("original_name", { length: 255 }).notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	publicId: varchar("public_id", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
