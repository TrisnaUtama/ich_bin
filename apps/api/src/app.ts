import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { settings } from "./configs/settings";
import { AppError, ErrorCode } from "./errors";
import { createRouter } from "./lib/create-router";
import { ApiResponse } from "./lib/api-response";
import { logger } from "./lib/logger";
import { i18nMiddleware, loggerMiddleware } from "./middlewares";
import { authRoutes } from "./modules/auth/auth.route";
import { usersRoutes } from "./modules/users/users.route";

export const app = createRouter();

app.use("*", loggerMiddleware);
app.use(
	"*",
	cors({
		origin: settings.cors.origins,
		allowHeaders: ["Content-Type", "Authorization", "Accept-Language"],
		allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
	}),
);
app.use("*", i18nMiddleware);

app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
});

app.onError((err, c) => {
	if (err instanceof AppError) {
		return ApiResponse.error(c, err);
	}

	logger.error(err, "unhandled error");
	return ApiResponse.error(c, new AppError(500, ErrorCode.INTERNAL_ERROR));
});

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/auth", authRoutes);
app.route("/users", usersRoutes);

app.doc("/openapi.json", {
	openapi: "3.0.0",
	info: {
		title: "Kinnetic API",
		version: "0.0.1",
		description: "ZineForge / Kinnetic backend API",
	},
});

app.get(
	"/docs",
	apiReference({
		theme: "purple",
		pageTitle: "Kinnetic API Docs",
		spec: { url: "/openapi.json" },
	}),
);
