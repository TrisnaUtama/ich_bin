import type { z } from "@hono/zod-openapi";
import type {
	googleLoginRequestSchema,
	refreshRequestSchema,
	tokenPairResponseSchema,
} from "./auth.schema";

export type GoogleLoginRequest = z.infer<typeof googleLoginRequestSchema>;
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;
export type TokenPair = z.infer<typeof tokenPairResponseSchema>;

export type RequestMeta = {
	userAgent?: string;
	ipAddress?: string;
};
