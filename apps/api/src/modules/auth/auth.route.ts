import { createRoute } from "@hono/zod-openapi";
import { createRouter } from "../../lib/create-router";
import {
	errorResponseSchema,
	successResponseSchema,
} from "../../lib/openapi-schemas";
import { authController } from "./auth.controller";
import {
	googleLoginRequestSchema,
	refreshRequestSchema,
	tokenPairResponseSchema,
} from "./auth.schema";

export const authRoutes = createRouter();

const tokenPairEnvelopeSchema = successResponseSchema(
	tokenPairResponseSchema,
	"TokenPairResponse",
);

const googleLoginRoute = createRoute({
	method: "post",
	path: "/google",
	tags: ["Auth"],
	summary: "Login or register with a Google ID token",
	request: {
		body: {
			content: { "application/json": { schema: googleLoginRequestSchema } },
		},
	},
	responses: {
		200: {
			description: "Login/register succeeded",
			content: { "application/json": { schema: tokenPairEnvelopeSchema } },
		},
		401: {
			description: "Invalid Google token",
			content: { "application/json": { schema: errorResponseSchema } },
		},
		403: {
			description: "Google email is not verified",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

const refreshRoute = createRoute({
	method: "post",
	path: "/refresh",
	tags: ["Auth"],
	summary: "Exchange a refresh token for a new access + refresh token pair",
	request: {
		body: { content: { "application/json": { schema: refreshRequestSchema } } },
	},
	responses: {
		200: {
			description: "New token pair issued",
			content: { "application/json": { schema: tokenPairEnvelopeSchema } },
		},
		401: {
			description: "Refresh token is invalid, expired, or reused",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

const logoutRoute = createRoute({
	method: "post",
	path: "/logout",
	tags: ["Auth"],
	summary: "Revoke a refresh token (logs out that one session)",
	request: {
		body: { content: { "application/json": { schema: refreshRequestSchema } } },
	},
	responses: {
		204: { description: "Logged out" },
	},
});

authRoutes.openapi(googleLoginRoute, authController.googleLogin);
authRoutes.openapi(refreshRoute, authController.refresh);
authRoutes.openapi(logoutRoute, authController.logout);
