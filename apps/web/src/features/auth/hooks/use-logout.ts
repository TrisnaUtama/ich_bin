import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useAuthStore } from "#/stores/auth-store";
import { authApi } from "../api/auth.api";

export function useLogout() {
	const navigate = useNavigate();
	const refreshToken = useAuthStore((state) => state.refreshToken);
	const clearSession = useAuthStore((state) => state.clearSession);
	const [isLoading, setIsLoading] = useState(false);

	const logout = useCallback(async () => {
		setIsLoading(true);
		try {
			// Best-effort — even if this fails (token already expired, network
			// hiccup, ...) we still clear the local session below.
			if (refreshToken) await authApi.logout(refreshToken);
		} catch (err) {
			console.error(err);
		} finally {
			clearSession();
			setIsLoading(false);
			await navigate({ to: "/login" });
		}
	}, [refreshToken, clearSession, navigate]);

	return { logout, isLoading };
}
