import { useAuthStore } from "#/stores/auth-store";

/** Read-only convenience hook for the current session — components that only need to know who's logged in shouldn't reach into the store directly. */
export function useAuth() {
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	return { user, isAuthenticated };
}
