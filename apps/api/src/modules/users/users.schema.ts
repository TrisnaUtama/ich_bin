import { z } from "@hono/zod-openapi";

export const meResponseSchema = z
	.object({
		id: z.string().uuid(),
		email: z.string().email(),
		name: z.string().nullable(),
		avatarUrl: z.string().nullable(),
		creditBalance: z.number().int(),
	})
	.openapi("UserProfile");
