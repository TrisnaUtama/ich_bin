import { createMiddleware } from "hono/factory";
import { resolveLocale } from "../i18n";
import type { AppEnv } from "../lib/hono-env";

/**
 * Resolves the request's locale (id/en/de) from an explicit `?lang=`
 * query param first, then the `Accept-Language` header, and puts it on
 * the context as c.get("locale") for every downstream handler/error to use.
 */
export const i18nMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const queryLang = c.req.query("lang");
	const locale = queryLang
		? resolveLocale(queryLang)
		: resolveLocale(c.req.header("Accept-Language"));

	c.set("locale", locale);
	await next();
});
