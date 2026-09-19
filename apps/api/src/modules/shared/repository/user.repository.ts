import { eq, type User, users } from "@kinnetic/db";
import { db } from "../../../configs/db";

/**
 * User data access shared across modules (auth needs it for
 * login/upsert, users needs it for profile lookups, other modules will
 * too). Anything specific to one module's own use case (e.g. auth's
 * refresh_tokens queries) stays in that module's own repository instead.
 */
export class UserRepository {
	async findById(userId: string): Promise<User | undefined> {
		const [row] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);
		return row;
	}

	async findByEmail(email: string): Promise<User | undefined> {
		const [row] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		return row;
	}

	async findByGoogleId(googleId: string): Promise<User | undefined> {
		const [row] = await db
			.select()
			.from(users)
			.where(eq(users.googleId, googleId))
			.limit(1);
		return row;
	}

	async linkGoogleAccount(
		userId: string,
		googleId: string,
		fallbackName: string | undefined,
		fallbackAvatarUrl: string | undefined,
	): Promise<User> {
		const [updated] = await db
			.update(users)
			.set({
				googleId,
				name: fallbackName,
				avatarUrl: fallbackAvatarUrl,
				updatedAt: new Date(),
			})
			.where(eq(users.id, userId))
			.returning();
		return updated!;
	}

	async createFromGoogle(data: {
		email: string;
		googleId: string;
		name?: string;
		avatarUrl?: string;
	}): Promise<User> {
		const [created] = await db.insert(users).values(data).returning();
		return created!;
	}
}

export const userRepository = new UserRepository();
