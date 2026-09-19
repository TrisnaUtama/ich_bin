import type { Context } from "hono";
import type {
	ContentfulStatusCode,
	ContentlessStatusCode,
} from "hono/utils/http-status";
import type { Locale } from "../configs/constants";
import type { AppError } from "../errors/app-error";
import { translate } from "../i18n";
import type { MessageCode } from "../i18n/message-codes";
import type { AppEnv } from "./hono-env";

export type SuccessResponseBody<T> = {
	success: true;
	message: string;
	data: T;
};

export type ErrorResponseBody = {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
};

/**
 * Every response the API sends goes through this instead of a controller
 * calling c.json(...) with a hand-rolled shape. It keeps the envelope
 * ({ success, message, data } / { success, error }) consistent across
 * every module, and makes sure the message is always translated for the
 * caller's locale (c.get("locale")) rather than hardcoded in English.
 *
 * The status params below are generic (`S extends ...StatusCode = <default>`)
 * instead of the plain `StatusCode` type — that's not just style: a route
 * wired through `.openapi()` is type-checked against the exact literal
 * status codes declared on it (200, 401, 403, ...). Typing `status` as the
 * wide `StatusCode` union loses that literal the moment it's passed
 * through, so TypeScript can no longer match the response against the
 * route's declared schemas and the whole handler fails to type-check.
 * Keeping `status` generic preserves whatever literal the caller passes.
 */
function resolveLocale(c: Context<AppEnv>): Locale {
	return c.get("locale") ?? "en";
}

export const ApiResponse = {
	/** 2xx (or any content-bearing) response carrying data, with a translated, machine-readable message code. */
	success<T, S extends ContentfulStatusCode = 200>(
		c: Context<AppEnv>,
		messageCode: MessageCode,
		data: T,
		status: S = 200 as S,
	) {
		const body: SuccessResponseBody<T> = {
			success: true,
			message: translate(messageCode, resolveLocale(c)),
			data,
		};
		return c.json(body, status);
	},

	/** Response with no body (e.g. 204 after logout). */
	noContent<S extends ContentlessStatusCode = 204>(
		c: Context<AppEnv>,
		status: S = 204 as S,
	) {
		return c.body(null, status);
	},

	/**
	 * Formats an AppError into the standard error envelope, translated for
	 * the caller's locale. Only ever called from app.ts's global onError
	 * hook (errors are thrown from services, never returned from a
	 * controller) — that hook isn't checked against a route's typed
	 * response schemas the way success()/noContent() are, so error.status
	 * doesn't need the same literal-preserving generic treatment.
	 */
	error(c: Context<AppEnv>, error: AppError) {
		const body: ErrorResponseBody = {
			success: false,
			error: {
				code: error.code,
				message: translate(error.code, resolveLocale(c)),
				...(error.details !== undefined ? { details: error.details } : {}),
			},
		};
		return c.json(body, error.status);
	},
};
