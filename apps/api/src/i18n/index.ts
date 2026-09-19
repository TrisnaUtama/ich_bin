import { type Locale, SUPPORTED_LOCALES } from "../configs/constants";
import { settings } from "../configs/settings";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { id } from "./locales/id";
import type { MessageCode } from "./message-codes";

export * from "./message-codes";
export * from "./success-codes";

const dictionaries: Record<Locale, Record<MessageCode, string>> = {
	id,
	en,
	de,
};

export function translate(code: MessageCode, locale: Locale): string {
	const dict =
		dictionaries[locale] ?? dictionaries[settings.i18n.defaultLocale];
	return dict[code] ?? code;
}

/**
 * Parses an Accept-Language header (e.g. "id-ID,id;q=0.9,en;q=0.8") and
 * picks the first language the app supports, falling back to
 * settings.i18n.defaultLocale if none match.
 */
export function resolveLocale(
	acceptLanguageHeader: string | undefined | null,
): Locale {
	if (!acceptLanguageHeader) return settings.i18n.defaultLocale;

	const candidates = acceptLanguageHeader
		.split(",")
		.map((part) => part.split(";")[0]?.trim().slice(0, 2).toLowerCase());

	for (const candidate of candidates) {
		if (SUPPORTED_LOCALES.includes(candidate as Locale)) {
			return candidate as Locale;
		}
	}

	return settings.i18n.defaultLocale;
}
