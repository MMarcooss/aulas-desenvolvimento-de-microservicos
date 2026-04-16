import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  permissions: text("permissions").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  
});

export const teachersSchema = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersSchema.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  document: varchar("document", { length: 20 }).notNull().unique(),
  degree: varchar("degree", { length: 100 }).notNull(),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  admissionDate: timestamp("admission_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});