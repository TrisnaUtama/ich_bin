import { OpenAPIHono } from "@hono/zod-openapi";
import { AppError, ErrorCode } from "../errors";
import type { AppEnv } from "./hono-env";

/**
 * Every module's route file should build its OpenAPIHono instance with
 * this instead of `new OpenAPIHono()` directly — it makes zod validation
 * failures (bad request body/query/params) throw the same AppError shape
 * as every other error, so app.ts's onError handler formats and
 * translates them consistently instead of returning zod-openapi's raw
 * default error format.
 */
export function createRouter() {
	return new OpenAPIHono<AppEnv>({
		defaultHook: (result) => {
			if (!result.success) {
				throw new AppError(
					400,
					ErrorCode.VALIDATION_ERROR,
					result.error.flatten(),
				);
			}
		},
	});
}
