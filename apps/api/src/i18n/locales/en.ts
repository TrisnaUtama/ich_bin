import type { MessageCode } from "../message-codes";

/**
 * satisfies Record<MessageCode, string> means TypeScript errors at
 * compile time if a new ErrorCode/SuccessCode is added but forgotten
 * here — the same safety a .json file can't give you.
 */
export const en = {
	VALIDATION_ERROR: "The submitted data is invalid.",
	INTERNAL_ERROR: "Something went wrong on our end. Please try again later.",
	NOT_FOUND: "The requested resource was not found.",
	AUTH_MISSING_BEARER_TOKEN: "Access token is missing.",
	AUTH_INVALID_ACCESS_TOKEN: "Access token is invalid or has expired.",
	AUTH_INVALID_GOOGLE_TOKEN: "The Google token is invalid.",
	AUTH_EMAIL_NOT_VERIFIED: "Your Google email is not verified.",
	AUTH_INVALID_REFRESH_TOKEN: "Refresh token is invalid.",
	AUTH_REFRESH_TOKEN_EXPIRED: "Refresh token has expired, please log in again.",
	AUTH_REFRESH_TOKEN_REUSED:
		"Refresh token reuse detected. All sessions have been revoked for your security.",
	USER_NOT_FOUND: "User not found.",

	LOGIN_SUCCESS: "Logged in successfully.",
	TOKEN_REFRESHED: "Token refreshed successfully.",
	LOGOUT_SUCCESS: "Logged out successfully.",
	PROFILE_FETCHED: "Profile fetched successfully.",
} satisfies Record<MessageCode, string>;
