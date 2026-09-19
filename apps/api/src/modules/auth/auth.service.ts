import { settings } from "../../configs/settings";
import { AppError, ErrorCode } from "../../errors";
import { generateRefreshToken, hashToken } from "../../lib/crypto";
import { verifyGoogleIdToken } from "../../lib/google";
import { signAccessToken } from "../../lib/jwt";
import {
	type AuthRepository,
	authRepository as defaultAuthRepository,
} from "./auth.repository";
import type { RequestMeta, TokenPair } from "./auth.types";

export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository = defaultAuthRepository,
	) {}

	/** Finds an existing user by Google id (linking by email on their first Google login), or creates one. */
	private async upsertUserFromGoogle(payload: {
		sub: string;
		email: string;
		name?: string;
		picture?: string;
	}) {
		const byGoogleId = await this.authRepository.findUserByGoogleId(
			payload.sub,
		);
		if (byGoogleId) return byGoogleId;

		const byEmail = await this.authRepository.findUserByEmail(payload.email);
		if (byEmail) {
			return this.authRepository.linkGoogleAccount(
				byEmail.id,
				payload.sub,
				byEmail.name ?? payload.name,
				byEmail.avatarUrl ?? payload.picture,
			);
		}

		return this.authRepository.createUserFromGoogle({
			email: payload.email,
			googleId: payload.sub,
			name: payload.name,
			avatarUrl: payload.picture,
		});
	}

	private async issueTokenPair(
		userId: string,
		meta: RequestMeta,
	): Promise<TokenPair> {
		const accessToken = await signAccessToken(userId);
		const rawRefreshToken = generateRefreshToken();
		const tokenHash = await hashToken(rawRefreshToken);
		const expiresAt = new Date(
			Date.now() + settings.jwt.refreshTtlDays * 24 * 60 * 60 * 1000,
		);

		await this.authRepository.insertRefreshToken({
			userId,
			tokenHash,
			expiresAt,
			userAgent: meta.userAgent,
			ipAddress: meta.ipAddress,
		});

		return { accessToken, refreshToken: rawRefreshToken };
	}

	async loginWithGoogle(
		idToken: string,
		meta: RequestMeta,
	): Promise<TokenPair> {
		let payload: Awaited<ReturnType<typeof verifyGoogleIdToken>>;

		try {
			payload = await verifyGoogleIdToken(idToken);
		} catch {
			throw new AppError(401, ErrorCode.AUTH_INVALID_GOOGLE_TOKEN);
		}

		if (!payload.emailVerified) {
			throw new AppError(403, ErrorCode.AUTH_EMAIL_NOT_VERIFIED);
		}

		const user = await this.upsertUserFromGoogle(payload);
		return this.issueTokenPair(user.id, meta);
	}

	/**
	 * Rotates a refresh token: the old one is marked revoked and linked to
	 * the new one via replacedByTokenId. If a token that's already been
	 * rotated (or manually revoked) gets used again, that's a sign it may
	 * have leaked — every active token for that user gets revoked so the
	 * real owner has to log in again.
	 */
	async rotateRefreshToken(
		rawToken: string,
		meta: RequestMeta,
	): Promise<TokenPair> {
		const tokenHash = await hashToken(rawToken);
		const existing =
			await this.authRepository.findRefreshTokenByHash(tokenHash);

		if (!existing) {
			throw new AppError(401, ErrorCode.AUTH_INVALID_REFRESH_TOKEN);
		}

		if (existing.revokedAt) {
			await this.authRepository.revokeAllRefreshTokensForUser(existing.userId);
			throw new AppError(401, ErrorCode.AUTH_REFRESH_TOKEN_REUSED);
		}

		if (existing.expiresAt.getTime() < Date.now()) {
			throw new AppError(401, ErrorCode.AUTH_REFRESH_TOKEN_EXPIRED);
		}

		const newPair = await this.issueTokenPair(existing.userId, meta);
		const newTokenHash = await hashToken(newPair.refreshToken);
		const newRow =
			await this.authRepository.findRefreshTokenByHash(newTokenHash);

		await this.authRepository.revokeRefreshTokenById(existing.id, newRow?.id);

		return newPair;
	}

	async revokeRefreshToken(rawToken: string): Promise<void> {
		const tokenHash = await hashToken(rawToken);
		const existing =
			await this.authRepository.findRefreshTokenByHash(tokenHash);
		if (existing) {
			await this.authRepository.revokeRefreshTokenById(existing.id);
		}
	}
}

export const authService = new AuthService();
