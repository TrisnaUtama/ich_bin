/**
 * Every error the API can return gets a stable machine-readable code here.
 * The code is what clients should branch on (never the message — that's
 * translated and can change wording). Each code maps 1:1 to an i18n key
 * in src/i18n/locales/*.json.
 */
export const ErrorCode = {
	VALIDATION_ERROR: "VALIDATION_ERROR",
	INTERNAL_ERROR: "INTERNAL_ERROR",
	NOT_FOUND: "NOT_FOUND",

	AUTH_MISSING_BEARER_TOKEN: "AUTH_MISSING_BEARER_TOKEN",
	AUTH_INVALID_ACCESS_TOKEN: "AUTH_INVALID_ACCESS_TOKEN",
	AUTH_INVALID_GOOGLE_TOKEN: "AUTH_INVALID_GOOGLE_TOKEN",
	AUTH_EMAIL_NOT_VERIFIED: "AUTH_EMAIL_NOT_VERIFIED",
	AUTH_INVALID_REFRESH_TOKEN: "AUTH_INVALID_REFRESH_TOKEN",
	AUTH_REFRESH_TOKEN_EXPIRED: "AUTH_REFRESH_TOKEN_EXPIRED",
	AUTH_REFRESH_TOKEN_REUSED: "AUTH_REFRESH_TOKEN_REUSED",

	USER_NOT_FOUND: "USER_NOT_FOUND",
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];
