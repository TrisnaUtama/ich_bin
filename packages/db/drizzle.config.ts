import { defineConfig } from "drizzle-kit";

const required = ["DB_HOST", "DB_PORT", "DB_USERNAME", "DB_PASSWORD", "DB_NAME"] as const;
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
	throw new Error(
		`Missing env vars: ${missing.join(", ")} — copy .env.example to .env first`,
	);
}

export default defineConfig({
	schema: "./src/schema/index.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.DB_HOST!,
		port: Number(process.env.DB_PORT),
		user: process.env.DB_USERNAME!,
		password: process.env.DB_PASSWORD!,
		database: process.env.DB_NAME!,
	},
	strict: true,
	verbose: true,
});
