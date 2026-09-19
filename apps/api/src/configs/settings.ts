import { z } from "zod";

/**
 * Single source of truth for env vars — nothing else in this app should
 * touch process.env directly. Add a new var here, it's validated at boot
 * (app crashes immediately with a clear message if it's missing/invalid,
 * instead of failing weirdly later at request time).
 */
const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	PORT: z.coerce.number().int().positive().default(3001),

	DB_HOST: z.string().min(1),
	DB_PORT: z.coerce.number().int().positive().default(5432),
	DB_USERNAME: z.string().min(1),
	DB_PASSWORD: z.string().min(1),
	DB_NAME: z.string().min(1),

	// Google OAuth — used to verify the ID token's audience on /auth/google
	GOOGLE_CLIENT_ID: z.string().min(1),

	// our own JWTs (access tokens)
	JWT_SECRET: z.string().min(32, "JWT_SECRET should be at least 32 characters"),
	JWT_ACCESS_TTL: z.string().default("15m"),

	// refresh tokens are opaque + DB-backed, this just controls their lifetime
	JWT_REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(30),

	// i18n
	DEFAULT_LOCALE: z.enum(["id", "en", "de"]).default("en"),

	// comma-separated list of origins allowed to call this API from a
	// browser (the frontend's dev server / deployed domain)
	CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

function loadEnv() {
	const parsed = envSchema.safeParse(process.env);

	if (!parsed.success) {
		console.error("Invalid environment variables:");
		console.error(parsed.error.flatten().fieldErrors);
		throw new Error(
			"Invalid environment variables — check apps/api/.env against .env.example",
		);
	}

	return parsed.data;
}

const env = loadEnv();

function buildDatabaseUrl() {
	const user = encodeURIComponent(env.DB_USERNAME);
	const password = encodeURIComponent(env.DB_PASSWORD);
	return `postgres://${user}:${password}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
}

export const settings = {
	nodeEnv: env.NODE_ENV,
	isProduction: env.NODE_ENV === "production",
	port: env.PORT,
	database: {
		host: env.DB_HOST,
		port: env.DB_PORT,
		username: env.DB_USERNAME,
		name: env.DB_NAME,
		url: buildDatabaseUrl(),
	},
	google: {
		clientId: env.GOOGLE_CLIENT_ID,
	},
	jwt: {
		secret: env.JWT_SECRET,
		accessTtl: env.JWT_ACCESS_TTL,
		refreshTtlDays: env.JWT_REFRESH_TTL_DAYS,
	},
	i18n: {
		defaultLocale: env.DEFAULT_LOCALE,
	},
	cors: {
		origins: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
	},
} as const;
