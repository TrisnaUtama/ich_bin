import { de } from "./de";
import { en } from "./en";
import { id } from "./id";

export type { Dictionary } from "./en";

export const LOCALES = ["en", "id", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
	en: "ENG",
	id: "IND",
	de: "DEU",
};

export const dictionaries = { en, id, de };

export const DEFAULT_LOCALE: Locale = "en";
