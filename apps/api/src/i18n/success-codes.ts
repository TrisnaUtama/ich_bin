/**
 * Machine-readable codes for successful responses, mirroring
 * errors/error-codes.ts on the happy-path side — every one of these maps
 * 1:1 to a translated message in src/i18n/locales/*.ts, resolved by
 * ApiResponse.success() based on the caller's locale.
 */
export const SuccessCode = {
	LOGIN_SUCCESS: "LOGIN_SUCCESS",
	TOKEN_REFRESHED: "TOKEN_REFRESHED",
	LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
	PROFILE_FETCHED: "PROFILE_FETCHED",
} as const;

export type SuccessCodeValue = (typeof SuccessCode)[keyof typeof SuccessCode];
