import { eq, type NewRefreshToken, refreshTokens } from "@kinnetic/db";
import { db } from "../../configs/db";
import {
	userRepository as sharedUserRepository,
	type UserRepository,
} from "../shared/repository/user.repository";

/**
 * Auth-specific data access: refresh tokens, plus the user lookups/upserts
 * it needs to log someone in. The user queries themselves live in
 * modules/shared/repository (other modules need them too) — this class
 * just composes that shared repository instead of duplicating its queries.
 */
export class AuthRepository {
	constructor(private readonly users: UserRepository = sharedUserRepository) {}

	findUserByGoogleId(googleId: string) {
		return this.users.findByGoogleId(googleId);
	}

	findUserByEmail(email: string) {
		return this.users.findByEmail(email);
	}

	linkGoogleAccount(
		userId: string,
		googleId: string,
		fallbackName: string | undefined,
		fallbackAvatarUrl: string | undefined,
	) {
		return this.users.linkGoogleAccount(
			userId,
			googleId,
			fallbackName,
			fallbackAvatarUrl,
		);
	}

	createUserFromGoogle(data: {
		email: string;
		googleId: string;
		name?: string;
		avatarUrl?: string;
	}) {
		return this.users.createFromGoogle(data);
	}

	/** Everything below is specific to auth: refresh token data access. */

	async insertRefreshToken(data: NewRefreshToken) {
		const [row] = await db.insert(refreshTokens).values(data).returning();
		return row!;
	}

	async findRefreshTokenByHash(tokenHash: string) {
		const [row] = await db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.tokenHash, tokenHash))
			.limit(1);
		return row;
	}

	async revokeRefreshTokenById(id: string, replacedByTokenId?: string) {
		await db
			.update(refreshTokens)
			.set({ revokedAt: new Date(), replacedByTokenId })
			.where(eq(refreshTokens.id, id));
	}

	async revokeAllRefreshTokensForUser(userId: string) {
		await db
			.update(refreshTokens)
			.set({ revokedAt: new Date() })
			.where(eq(refreshTokens.userId, userId));
	}
}

export const authRepository = new AuthRepository();
