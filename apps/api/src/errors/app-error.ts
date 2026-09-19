import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ErrorCodeValue } from "./error-codes";

/**
 * Every intentional error thrown from a service/repository should be an
 * AppError — the global error handler (see app.ts) knows how to translate
 * and format it. Anything else thrown is treated as an unexpected bug and
 * returned as a generic 500 (details logged server-side, never leaked to
 * the client).
 *
 * status is typed as ContentfulStatusCode (not the wider StatusCode) —
 * every AppError is always rendered with a JSON error body, so a
 * content-less code (204/205/304) or the -1 "unofficial" placeholder is
 * never valid here, and this is also what lets ApiResponse.error() pass
 * it straight to c.json() without an extra cast.
 */
export class AppError extends Error {
	status: ContentfulStatusCode;
	code: ErrorCodeValue;
	/** Extra structured info for the client — e.g. which fields failed validation. Never put sensitive data here. */
	details?: unknown;

	constructor(status: ContentfulStatusCode, code: ErrorCodeValue, details?: unknown) {
		super(code);
		this.name = "AppError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}
