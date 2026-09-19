import { createRoute } from "@hono/zod-openapi";
import { createRouter } from "../../lib/create-router";
import {
	errorResponseSchema,
	successResponseSchema,
} from "../../lib/openapi-schemas";
import { requireAuth } from "../../middlewares";
import { usersController } from "./users.controller";
import { meResponseSchema } from "./users.schema";

export const usersRoutes = createRouter();

const meRoute = createRoute({
	method: "get",
	path: "/me",
	tags: ["Users"],
	summary: "Get the currently authenticated user's profile",
	security: [{ bearerAuth: [] }],
	middleware: [requireAuth] as const,
	responses: {
		200: {
			description: "The current user's profile",
			content: {
				"application/json": {
					schema: successResponseSchema(
						meResponseSchema,
						"UserProfileResponse",
					),
				},
			},
		},
		401: {
			description: "Missing or invalid access token",
			content: { "application/json": { schema: errorResponseSchema } },
		},
		404: {
			description: "User not found",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
});

usersRoutes.openapi(meRoute, usersController.getMe);
