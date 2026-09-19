import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../lib/hono-env";
import { logger } from "../lib/logger";

/** Logs every request: method, path, status, and how long it took. */
export const loggerMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const start = Date.now();

	await next();

	logger.info(
		{
			method: c.req.method,
			path: c.req.path,
			status: c.res.status,
			durationMs: Date.now() - start,
		},
		"request completed",
	);
});
