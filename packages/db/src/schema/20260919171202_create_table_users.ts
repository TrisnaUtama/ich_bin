import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { citext } from "./20260919171146_create_helper";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: citext("email").notNull().unique(),
	name: text("name"),
	avatarUrl: text("avatar_url"),
	googleId: text("google_id").unique(),
	creditBalance: integer("credit_balance").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
