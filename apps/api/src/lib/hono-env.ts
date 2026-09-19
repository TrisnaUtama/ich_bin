import type { Locale } from "../configs/constants";

/** Shared Hono context typing, used by every route/middleware in the app. */
export type AppEnv = {
	Variables: {
		userId: string;
		locale: Locale;
	};
};
