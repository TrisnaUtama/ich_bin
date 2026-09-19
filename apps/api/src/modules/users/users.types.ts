import type { z } from "@hono/zod-openapi";
import type { meResponseSchema } from "./users.schema";

export type UserProfile = z.infer<typeof meResponseSchema>;
