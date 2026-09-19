import { registerRefreshHandler } from "#/lib/api/client";
import { useAuthStore } from "#/stores/auth-store";
import { authApi } from "./api/auth.api";

/**
 * Wires the api client's silent-refresh hook up to this feature's own
 * refresh endpoint + store — kept separate from lib/api/client.ts to
 * avoid a circular import (client.ts <-> auth.api.ts), and called once
 * at app startup (see main.tsx).
 */
export function registerAuthRefreshHandler() {
	registerRefreshHandler(async () => {
		const { refreshToken, setSession, clearSession } = useAuthStore.getState();

		if (!refreshToken) {
			clearSession();
			throw new Error("No refresh token available");
		}

		try {
			const tokens = await authApi.refresh(refreshToken);
			setSession(tokens);
		} catch (err) {
			clearSession();
			throw err;
		}
	});
}
