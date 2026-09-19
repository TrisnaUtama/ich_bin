import { apiClient } from "#/lib/api/client";
import type { AuthUser } from "#/stores/auth-store";

export type TokenPair = {
	accessToken: string;
	refreshToken: string;
};

/**
 * Thin wrapper around the /auth and /users/me endpoints — the only file
 * in the app that should know these paths. Login/refresh/logout go with
 * `auth: false` since there's no access token yet to attach (or, for
 * logout, it genuinely doesn't matter).
 */
export const authApi = {
	loginWithGoogle: (idToken: string) =>
		apiClient.post<TokenPair>("/auth/google", { idToken }, { auth: false }),

	refresh: (refreshToken: string) =>
		apiClient.post<TokenPair>(
			"/auth/refresh",
			{ refreshToken },
			{ auth: false },
		),

	logout: (refreshToken: string) =>
		apiClient.post<void>("/auth/logout", { refreshToken }, { auth: false }),

	me: () => apiClient.get<AuthUser>("/users/me"),
};
