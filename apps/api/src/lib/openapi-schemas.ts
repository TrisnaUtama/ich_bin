import { z } from "@hono/zod-openapi";

/** Shared error response shape, referenced by every route's error responses in the OpenAPI docs. */
export const errorResponseSchema = z
	.object({
		success: z.literal(false).openapi({ example: false }),
		error: z.object({
			code: z.string().openapi({ example: "AUTH_INVALID_REFRESH_TOKEN" }),
			message: z.string().openapi({ example: "Refresh token is invalid." }),
			details: z.unknown().optional(),
		}),
	})
	.openapi("ErrorResponse");

/**
 * Wraps a route's data schema in the shared success envelope
 * ({ success, message, data }) that ApiResponse.success() actually
 * returns at runtime, so the OpenAPI docs match the real response shape.
 */
export function successResponseSchema<T extends z.ZodTypeAny>(
	dataSchema: T,
	name: string,
) {
	return z
		.object({
			success: z.literal(true).openapi({ example: true }),
			message: z.string().openapi({ example: "Success." }),
			data: dataSchema,
		})
		.openapi(name);
}
