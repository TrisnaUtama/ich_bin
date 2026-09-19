import { createMiddleware } from "hono/factory";
import { AppError, ErrorCode } from "../errors";
import type { AppEnv } from "../lib/hono-env";
import { verifyAccessToken } from "../lib/jwt";

/** Protects a route: requires a valid `Authorization: Bearer <accessToken>` header, sets c.get("userId"). */
export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
	const header = c.req.header("Authorization");
	const token = header?.startsWith("Bearer ")
		? header.slice("Bearer ".length)
		: undefined;

	if (!token) {
		throw new AppError(401, ErrorCode.AUTH_MISSING_BEARER_TOKEN);
	}

	try {
		const payload = await verifyAccessToken(token);
		c.set("userId", payload.sub);
	} catch {
		throw new AppError(401, ErrorCode.AUTH_INVALID_ACCESS_TOKEN);
	}

	await next();
});
