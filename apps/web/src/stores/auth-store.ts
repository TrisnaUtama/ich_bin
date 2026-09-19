import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
	id: string;
	email: string;
	name: string | null;
	avatarUrl: string | null;
	creditBalance: number;
};

type AuthState = {
	accessToken: string | null;
	refreshToken: string | null;
	user: AuthUser | null;
	isAuthenticated: boolean;

	setSession: (session: { accessToken: string; refreshToken: string }) => void;
	setUser: (user: AuthUser) => void;
	clearSession: () => void;
};

/**
 * Persisted to localStorage so a page refresh doesn't log the user out.
 *
 * Tradeoff worth knowing: the backend currently returns the refresh token
 * in the JSON response body (not an httpOnly cookie), so storing it here
 * is the only option right now — but it does mean it's readable by any
 * script on the page (XSS risk). Moving refresh-token storage to an
 * httpOnly cookie set by the API is a good follow-up once that's wired up
 * on the backend; nothing on the frontend besides this store would need
 * to change.
 */
export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			accessToken: null,
			refreshToken: null,
			user: null,
			isAuthenticated: false,

			setSession: ({ accessToken, refreshToken }) =>
				set({ accessToken, refreshToken, isAuthenticated: true }),

			setUser: (user) => set({ user }),

			clearSession: () =>
				set({
					accessToken: null,
					refreshToken: null,
					user: null,
					isAuthenticated: false,
				}),
		}),
		{
			name: "kinnetic-auth",
			partialize: (state) => ({
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
