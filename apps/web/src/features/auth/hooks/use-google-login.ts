import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { DEFAULT_TEMPLATE } from "#/engine/templateList";
import { useAuthStore } from "#/stores/auth-store";
import { authApi } from "../api/auth.api";
import { useGoogleIdToken } from "./use-google-id-token";

/**
 * Orchestrates the full Google login flow used by the login page's
 * GoogleButton: get an ID token from Google -> exchange it for our own
 * access/refresh token pair -> fetch the profile -> land on the editor.
 */
export function useGoogleLogin() {
	const { requestIdToken, isReady } = useGoogleIdToken();
	const setSession = useAuthStore((state) => state.setSession);
	const setUser = useAuthStore((state) => state.setUser);
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = useCallback(async () => {
		setError(null);
		setIsLoading(true);

		try {
			const idToken = await requestIdToken();
			const tokens = await authApi.loginWithGoogle(idToken);
			setSession(tokens);

			const profile = await authApi.me();
			setUser(profile);

			await navigate({ to: "/editor", search: { template: DEFAULT_TEMPLATE } });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login gagal, coba lagi.");
		} finally {
			setIsLoading(false);
		}
	}, [requestIdToken, setSession, setUser, navigate]);

	return { login, isLoading, isReady, error };
}
