import {
	boolean,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { templateCategories } from "./20260919171251_create_table_template_categories";

export type TemplateConfig = {
	layers: unknown[];
	[key: string]: unknown;
};

export const templates = pgTable("templates", {
	id: uuid("id").primaryKey().defaultRandom(),
	categoryId: uuid("category_id").references(() => templateCategories.id),
	name: text("name").notNull(),
	description: text("description"),
	thumbnailUrl: text("thumbnail_url"),
	config: jsonb("config").$type<TemplateConfig>().notNull(),
	isPremium: boolean("is_premium").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
