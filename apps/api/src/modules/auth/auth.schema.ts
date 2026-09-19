import { z } from "@hono/zod-openapi";

export const googleLoginRequestSchema = z
	.object({
		idToken: z.string().min(1).openapi({
			description:
				"The ID token returned by Google Sign-In on the frontend (not a Google access token).",
			example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
		}),
	})
	.openapi("GoogleLoginRequest");

export const refreshRequestSchema = z
	.object({
		refreshToken: z.string().min(1),
	})
	.openapi("RefreshRequest");

export const tokenPairResponseSchema = z
	.object({
		accessToken: z.string(),
		refreshToken: z.string(),
	})
	.openapi("TokenPair");
