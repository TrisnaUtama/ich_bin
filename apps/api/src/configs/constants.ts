/** App-wide constants that aren't secrets/env — safe to hardcode and import anywhere. */

export const SUPPORTED_LOCALES = ["id", "en", "de"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const PAGINATION = {
	defaultLimit: 20,
	maxLimit: 100,
} as const;

export const COOKIE_NAMES = {
	refreshToken: "kinnetic_refresh_token",
} as const;
