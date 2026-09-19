import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	PORT: z.coerce.number().int().positive().default(3001),
	DATABASE_URL: z.string().url(),
});

function loadEnv() {
	const parsed = envSchema.safeParse(process.env);

	if (!parsed.success) {
		console.error("Invalid environment variables:");
		console.error(parsed.error.flatten().fieldErrors);
		throw new Error("Invalid environment variables — check apps/api/.env against .env.example");
	}

	return parsed.data;
}

const env = loadEnv();

export const config = {
	nodeEnv: env.NODE_ENV,
	isProduction: env.NODE_ENV === "production",
	port: env.PORT,
	database: {
		url: env.DATABASE_URL,
	},
} as const;
