import { timestamp, uuid, text, pgTable } from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	teacherId: uuid("teacher_id"),
	permissions: text("permissions").array().notNull().default([]),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
