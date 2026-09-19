import { type AnyPgColumn, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./20260919171202_create_table_users";

// selfReference is needed because a refresh token can point to the token
// that replaced it (rotation chain) — same pattern as
// projects.currentVersionId -> projectVersions in the projects schema.
export const refreshTokens = pgTable("refresh_tokens", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),

	// SHA-256 hash of the raw refresh token — the raw value is only ever
	// returned to the client once, at issuance. Never store it plaintext.
	tokenHash: text("token_hash").notNull().unique(),

	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	revokedAt: timestamp("revoked_at", { withTimezone: true }),

	// set when this token is rotated out for a new one — lets us detect
	// reuse of an already-rotated token (a sign it may have been stolen)
	// and revoke the whole chain if that happens.
	replacedByTokenId: uuid("replaced_by_token_id").references(
		(): AnyPgColumn => refreshTokens.id,
	),

	userAgent: text("user_agent"),
	ipAddress: text("ip_address"),

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
